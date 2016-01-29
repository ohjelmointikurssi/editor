TMCWebClient.editor = function (container, exercise) {

    var Range = ace.require('ace/range').Range;

    var _template = {
            editor: Handlebars.templates.Editor
        },

        _container = container,
        _navBar,
        _offsetLeftFix = 0,
        _editor,
        _output,
        _intervalId,
        _exercise = exercise,
        _filename,
        _spyware = new TMCWebClient.spyware(exercise),
        _snapshotCache = {};

    function configure(editor) {

        // Editor
        editor.setPrintMarginColumn(false);
        editor.setDisplayIndentGuides(false);
        editor.getSession().setFoldStyle('markbeginend');

        // Text
        editor.setTheme('ace/theme/tomorrow');
        editor.setFontSize(13);
        editor.getSession().setTabSize(4);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setWrapLimitRange(90, 90);
        editor.getSession().setMode('ace/mode/javascript');

        editor.$blockScrolling = Infinity;
    }

    function initialise() {
        // Create container for editor
        var editorContainer = $('<div/>');

        // Add editor container to container
        $(_container).hide();

        $(_container).append(editorContainer);

        // Create editor
        _editor = ace.edit(editorContainer.get(0));
        configure(_editor);

        // Fetch exercise
        _exercise.fetchZip(function () {
          var files = _exercise.getFilesFromSource()
            _filename = files[0].name;
            var content = _exercise.getFile(_filename).asText();

            // Render
            render(files);
            setFileMode(_filename);
            show(content);
            createMarkers(_filename);

            // Set active tab
            $('.tab-bar li', _container).first().addClass('active');

            _editor.on('change', snapshotHandler);
        });

        createOutputContainer();
    }

    var _markers = [];
    var _ranges = [];
    var _rangesNeedupdating = false;
    var _locked_regions = null;
    function createMarkers(filename) {
        _markers.forEach(function(marker) {
            _editor.getSession().removeMarker(marker);
        });
        _markers = [];
        _ranges = [];
        _locked_regions = _exercise.getLockedRegions(filename);
        _locked_regions.forEach(function (limits) {
            var range = new Range(limits[0], 0, limits[1], 900);
            _markers.push(_editor.session.addMarker(range, 'readonly-highlight', 'fullLine'));
            _ranges.push(range);
        });
        hideLockMarkers(filename);
    }
    var _folds = [];
    function hideLockMarkers(filename) {
        _folds.forEach(function(fold) {
            _editor.getSession().removeFold(fold);
        });
        _locked_regions.forEach(function (group) {
            group.forEach(function (lock_line) {
                if (lock_line === 0 || lock_line == _exercise.getFileLength(filename) - 1) {
                    return;
                }
                try {
                    _folds.push(_editor.session.addFold("", new Range(lock_line, 0, lock_line, 900)));
                } catch(e) {
                    console.warn('Problems with adding folds');
                }

            });
        });
    }

    function snapshotHandler(e) {

        if (_filename === undefined) {
            return;
        }

        var previous = _exercise.getFile(_filename).asText();

        if (_snapshotCache[_filename] === undefined) {
            _spyware.add(new TMCWebClient.snapshot(_exercise, 'insertText', TMCWebClient.snapshot.prototype.generatePatchData(_filename, '', previous, true)));
        }

        _spyware.add(new TMCWebClient.snapshot(_exercise, e.action, TMCWebClient.snapshot.prototype.generatePatchData(_filename, previous, _editor.getValue(), false)));
        _snapshotCache[_filename] = true;
        saveActiveFile();
    }

    function generateFullSnapshot(file, cause, onlyChanged) {

        if (onlyChanged && _snapshotCache[file] !== true) {
            return;
        }
        if (_snapshotCache[file]) {
            _snapshotCache[file] = false;
        }
        _spyware.add(new TMCWebClient.snapshot(_exercise, 'code_snapshot', _exercise.getSrcZip({compression: 'DEFLATE'}),{cause: cause,file: file}));
    }

    function createOutputContainer() {

        _output = new TMCWebClient.output(_container);
    }

    function createSubmitHandler() {

        $('.actions .submit', _container).first().click(submitOnClickHandler);
    }

    function submitOnClickHandler() {

        clearInterval(_intervalId);
        saveActiveFile();

        generateFullSnapshot(_filename, 'file_change', true);

        processingSubmission(true);
        _output.processing();

        _exercise.submit(function (data) {

            /* jshint camelcase:false */
            submissionPoller(data.submission_url);
            /* jshint camelcase:true */
        }, function (data) {

            _output.close();
            console.log(data);
        });

        _spyware.add(new TMCWebClient.snapshot(_exercise, 'project_action', TMCWebClient.snapshot.prototype.generateBase64Json({command: 'tmc.submit'})));
    }

    function submissionPoller(submissionUrl) {

        var intervalId = setInterval(function () {

            $.ajax(submissionUrl, {

                beforeSend: TMCWebClient.xhrBasicAuthentication,
                dataType: 'json',

                error: function (data) {

                    clearInterval(intervalId);
                    console.log(data);
                },

                success: function (data) {

                    if (data.status !== 'processing') {

                        clearInterval(intervalId);

                        _exercise.setLastSubmission(data);

                        processingSubmission(false);
                        showResults(data);
                    }
                }
            });
        }, 3000);

        _intervalId = intervalId;
    }

    function processingSubmission(state) {

        var submitElement = $('.actions .submit', _container).first();

        if (!state) {
            submitElement.removeClass('pulse');
            return;
        }

        submitElement.addClass('pulse');
    }

    function showResults(data) {

        _output.showResults(data);
    }

    function createLastSubmissionHandler() {

        $('.actions .output', _container).first().click(function () {

            // Toggle output
            if (_output.visible()) {

                _output.close();
                return;
            }

            _output.processing();
            _exercise.fetchLastSubmission(function (data) {

                showResults(data);

            }, function() {

                submitOnClickHandler();

            }, function(submissionUrl) {

                submissionPoller(submissionUrl);
            });
        });
    }

    function createNewFileHandler() {

        $('.actions .new', _container).first().click(function () {

            saveActiveFile();
            var path = _exercise.getSourcePath();
            var filename = prompt('Filename:');
            filename = filename.trim();

            if (!filename || filename.length === 0) {
                return;
            }

            clearEditor();

            filename = path + '/' + filename;
            setFileMode(filename);

            // Save new file
            _exercise.saveFile(filename, getTemplate(filename));

            // Update navigation bar
            update();
            _filename = filename;
        });
    }

    /* jshint ignore:start */
    var marker;
    /* jshint ignore:end */
    var _errors = [];

    var _code;
    function createRunHandler() {

        $('.actions .run', _container).first().click(function () {
            var gameFrame = document.getElementById("game-frame-" + _exercise.id);
            gameFrame.src = '';

            // We want to give the iframe an opportunity to reload.
            setTimeout(runCode, 100);
        });

        // Listens for messages from iframe
        window.addEventListener('message', function(e) {
          if (e.data.source === _exercise.id) {
            if (e.data.ready === true) {
              console.info('Setting the game frame to be ready...');
              _gameFrameReady = true;
            }
            if (e.data.message) {
              _output.render(e.data.message);
            }
            if(e.data.error) {
              stopGame();
              _errors.push(e.data.error);
              _output.renderError(_errors);
            }
            if (e.data.stop) {
              stopGame();
            }
          }
        });
    }

    function runCode() {
          /* jshint ignore:start */
          _errors = [];
          var gameFrame = document.getElementById("game-frame-" + _exercise.id);

          var pre = "(function () { 'use strict'; }()); var console={log: function(a){showMessage(a)}};"


          var code = Object.getOwnPropertyNames(_exercise.getFiles()).filter(function (o) {
            return o.endsWith('.js') && !o.endsWith('test.js');
          }).sort()
          .map(function (o) {
            return _exercise.getFiles()[o].asText();
          }).join('\n');

          // Check if the exercise is a game related exercise
          var isGame = Object.getOwnPropertyNames(_exercise.getFiles()).filter(function (o) {
            return o.endsWith('update.js');
          });
          code = pre + code;
          if (isGame.length !== 0) {
             code += "game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-area-' +" +  _exercise.id + ", { preload: preload, create: create, update: update });";
             $('#game-area-' + _exercise.id).html('');
             $('#game-frame-' +_exercise.id).removeClass('inactive');
             // $('#background-overlay').addClass('active');
          }
          code += ""
          var gameTemplate = Handlebars.templates.Game({ id: _exercise.id });

          gameFrame.contentWindow.document.write(gameTemplate);
          _code = code;
          // In case this is not the first run
          _gameFrameReady = false;
          waitForGameIframe();
          /* jshint ignore:end */
    }

    var _gameFrameReady = false;
    function waitForGameIframe() {
      var gameFrame = document.getElementById('game-frame-' + _exercise.id);
      var url = (window.location != window.parent.location) ? document.referrer: document.location;

      if (_gameFrameReady) {
        gameFrame.contentWindow.postMessage(_code, url);
        console.info('Sent the code to be executed');
      } else {
        console.info('Asking if the frame is ready.')
        gameFrame.contentWindow.postMessage('ready', '*');
        window.setTimeout(waitForGameIframe, 100);
      }
    }

    function createDeleteFileHandler() {

        $('.top .tab-bar li i.delete', _container).each(function (index, element) {

            // Get file id
            var id = $(element).parent().attr('data-id');

            $(element).click(function () {

                // Remove file
                _exercise.removeFile(id);
                delete _snapshotCache[_filename];
                generateFullSnapshot(_filename, 'file_delete');

                // If currently active tab equals deleted file, clear editor
                if ($('.top .tab-bar li.active', _container).attr('data-id') === id) {
                    clearEditor();
                }

                // Update navigation bar
                update();
            });
        });
    }

    function stopGame() {
        $('#background-overlay').removeClass('active');
        $('#game-frame-' + _exercise.id).addClass('inactive');
        /* jshint ignore:start */
        // This should kill all the remaining processes
        var gameFrame = document.getElementById("game-frame-" + _exercise.id);
        gameFrame.src = '';
        /* jshint ignore:end */
    }

    function createStopGameHandler() {
        $('#stop-game-' + _exercise.id).click(function(e) {
            e.preventDefault();
            stopGame();
        });
    }

    function createErrorHandler() {
      var previousError = window.onerror;
        window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
          // If the error is from the user's code and not from the libraries
          if (url === window.location.href || errorObj.showToUser) {
            _output.render(errorMsg, Handlebars.templates.OutputErrorContainer);
            stopGame();
          }
          return previousError(errorMsg, url, lineNumber, column, errorObj);
        }
    }

    function update() {

        // Delete navigation bar
        $('.top', _container).remove();

        // Render navigation bar
        render(_exercise.getFilesFromSource());

        // Set active tab
        changeFile($('.tab-bar li', _container).last());
    }

    function render(files) {

        var attributes = {

            title: _exercise.getName(),
            files: files

        }

        // Render editor
        $(_container).prepend(_template.editor(attributes));

        _navBar = $('.tab-bar', _container).first();

        _offsetLeftFix = $('li', _navBar)[0].offsetLeft;

        // Add click events to tabs
        $('li', _navBar).click(tabClick);

        createRunHandler();
        createStopGameHandler();
        createErrorHandler();
        createKeyboardHandler();
    }

    function createKeyboardHandler() {
        _editor.on('input', function() {
            if (_rangesNeedupdating) {
                createMarkers(_filename);
            }
        });
        _editor.keyBinding.addKeyboardHandler({
            handleKeyboard: function(data, hash, key, keyCode, event) {
                // In case of race condition
                if (_rangesNeedupdating) {
                    createMarkers(_filename);
                }
                if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) {
                    return false;
                }
                if (editingProtectedArea()) {
                    return { command: "null", passEvent: false };
                }
                if (keyCode === 13 || keyCode === 8 || keyCode === 46) {
                    _rangesNeedupdating = true;
                }
            }
        });
        preventEvent('onPaste');
        preventEvent('onCut');
    }

    function preventEvent(method_name) {
        var orig = _editor[method_name];
        _editor[method_name] = function() {
            var args = Array.prototype.slice.call(arguments);
            if (editingProtectedArea()) {
                return;
            }
            return orig.apply(_editor, args);
        }
    }

    function editingProtectedArea() {
        var selection = _editor.getSelectionRange();
        for (var i = 0; i < _ranges.length; i++) {
            if (selection.intersects(_ranges[i])) {
                return true;
            }
        }
        return false;
    }

    function show(content) {

        // Show container
        $(_container).show();

        _editor.setValue(content);

        // Clear selection
        _editor.getSelection().clearSelection();
        _editor.moveCursorTo(0, 0);
        _editor.getSession().setScrollTop(0);
    }

    function tabClick() {

        saveActiveFile();
        generateFullSnapshot(_filename, 'file_change', true);
        clearEditor();
        changeFile($(this));
    }

    function changeFile(element) {

        // Clear previous active tab
        $('.tab-bar li', _container).removeClass('active');

        // Set active tab
        element.addClass('active');

        scrollToTab(element);

        // File
        var filename = element.attr('data-id');
        var content = _exercise.getFile(filename).asText();
        setFileMode(filename);
        show(content);
        createMarkers(filename);
        _filename = filename;
    }

    function scrollToTab(element) {

        _navBar[0].scrollLeft = element[0].offsetLeft - _offsetLeftFix - _navBar.width() / 2 + element.width() / 2;
    }

    function getTemplate(filename) {

        var name = filename.substr(filename.lastIndexOf('/') + 1).split('.')[0],

            templates = {

            'c':    'int ' + name + '() { }',
            'h':    'int ' + name + '() { }',
            'html': '<!DOCTYPE html>\n<head>' +
                    '\n  <title>Title</title>' +
                    '\n</head>\n<body>\n  <p>' +
                    'Text</p>\n</body>\n</html>',
            'java': 'public class ' + name + ' { }',
            'js':   'function ' + name + '() { }'

        },

        // Get filename extension
        fileExtension = _exercise.getFileExtension(filename);

        // Set template or fallback to blank text if no template is specified for the filename extension
        return templates[fileExtension] || '';
    }

    function setFileMode(filename) {

        var modes = {

            'c':    'c_cpp',
            'css':  'css',
            'h':    'c_cpp',
            'htm':  'html',
            'html': 'html',
            'java': 'java',
            'js':   'javascript',
            'json': 'json',
            'rb':   'ruby',
            'xml':  'xml',
            'yml':  'yaml',
            'py': 'python'

        },

        // Fallback to text
        mode = 'text',

        // Get filename extension
        fileExtension = _exercise.getFileExtension(filename);

        // Set mode or fallback to text if no mode is specified for the filename extension
        mode = modes[fileExtension] || mode;

        _editor.getSession().setMode('ace/mode/' + mode);
    }

    function saveActiveFile() {

        _exercise.saveFile(_filename, _editor.getValue());
    }

    function clearEditor() {

        _filename = undefined;
        _editor.setValue('');
    }

    initialise();
}
