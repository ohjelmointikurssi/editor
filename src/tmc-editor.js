TMCWebClient.editor = function (container, exercise) {

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

            var files = _exercise.getFilesFromSource(),
                content = files[0].asText();

            _filename = files[0].name;

            // Render
            render(files);
            setFileMode(_filename);
            show(content);

            // Set active tab
            $('.tab-bar li', _container).first().addClass('active');

            _editor.on('change', snapshotHandler);
        });

        createOutputContainer();
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
    var game = null;
    /* jshint ignore:end */

    function createRunHandler() {

        $('.actions .run', _container).first().click(function () {
            /* jshint ignore:start */
            if (game != null) {
              game.destroy();
              game = null;
            }

            var game_string = "game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-area-' + _exercise.id, { preload: preload, create: create, update: update });"
            $('#game-area-' + _exercise.id).html('');
            $('#game-' +_exercise.id).removeClass('inactive');
            $('#background-overlay').addClass('active');

            var code = Object.getOwnPropertyNames(_exercise.getFiles()).filter(function (o) {
              return o.endsWith('.js') && !o.endsWith('test.js');
            }).sort()
            .map(function (o) {
              return _exercise.getFiles()[o].asText();
            }).join('\n');
            code = game_string + code;
            try {
              eval(code);
            } catch (e) {
              var re = /<anonymous>:(\d+):(\d+)/;
              var parsed = re.exec(e.stack);
              var message;
              if( parsed != null ) {
                var line = parsed[1];
                var char = parsed[2];
                message = e.name + " on line " + line + ", character " + char + ": " + e.message + ".";
              } else {
                message = e.stack;
              }

              //$('#program-output').text(message);

              if (marker != undefined) {
                _editor.getSession().removeMarker(marker);
              }
              var Range = require('ace/range').Range;
              var range = new Range(line - 1, char - 1, line - 1, 1000);
              marker = _editor.session.addMarker(range, "error-line", "text");
            }
            /* jshint ignore:end */
        });
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

    function createStopGameHandler() {
        $('#stop-game-' + _exercise.id).click(function(e) {
            e.preventDefault();
            $('#background-overlay').removeClass('active');
            $('#game-' + _exercise.id).addClass('inactive');
            if (game != null) {
              game.destroy();
              game = null;
            }
        });
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

        createSubmitHandler();
        createLastSubmissionHandler();
        createNewFileHandler();
        createDeleteFileHandler();
        createRunHandler();
        createStopGameHandler();
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
