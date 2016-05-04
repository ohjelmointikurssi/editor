TMCWebClient.editor = function (container, exercise) {
  var Range = ace.require('ace/range').Range;

  var _template = {
    editor: Handlebars.templates.Editor,
  };
  var _container = container;
  var _navBar;
  var _offsetLeftFix = 0;
  var _editor;
  var _output;
  var _exercise = exercise;
  var _filename;
  var _spyware = new TMCWebClient.spyware(exercise);
  var _snapshotCache = {};

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

    /* eslint-disable no-param-reassign */
    editor.$blockScrolling = Infinity;
    /* eslint-enable no-param-reassign */
  }

  var _folds = [];
  function hideLockMarkers(filename) {
    _folds.forEach(function(fold) {
      _editor.getSession().removeFold(fold);
    });
    _lockedRegions.forEach(function (group) {
      group.forEach(function (lockLine) {
        if (lockLine === 0) {
          return;
        }
        try {
          _folds.push(_editor.session.addFold('', new Range(lockLine, 0, lockLine, 900)));
        } catch (e) {
          console.warn('Problems with adding folds');
        }
      });
    });
  }

  var _markers = [];
  var _ranges = [];
  var _rangesNeedupdating = false;
  var _lockedRegions = null;
  function createMarkers(filename) {
    _markers.forEach(function(marker) {
      _editor.getSession().removeMarker(marker);
    });
    _markers = [];
    _ranges = [];
    _lockedRegions = _exercise.getLockedRegions(filename);
    _lockedRegions.forEach(function (limits) {
      var range = new Range(limits[0], 0, limits[1], 900);
      _markers.push(_editor.session.addMarker(range, 'readonly-highlight', 'fullLine'));
      _ranges.push(range);
    });
    hideLockMarkers(filename);
  }

  function snapshotHandler(e) {
    if (_filename === undefined) {
      return;
    }

    var previous = _exercise.getFile(_filename).asText();

    if (_snapshotCache[_filename] === undefined) {
      var patch = TMCWebClient.snapshot.prototype.generatePatchData(_filename, '', previous, true);
      _spyware.add(new TMCWebClient.snapshot(_exercise, 'insertText', patch));
    }

    _spyware.add(new TMCWebClient.snapshot(_exercise, e.action,
      TMCWebClient.snapshot.prototype.generatePatchData(_filename, previous, _editor.getValue(), false)
    ));
    _snapshotCache[_filename] = true;
    saveActiveFile();
  }

  function saveToLocalStorageHandler() {
    _exercise.storeCodeToLocalStorage();
  }

  function generateFullSnapshot(file, cause, onlyChanged) {
    if (onlyChanged && _snapshotCache[file] !== true) {
      return;
    }
    if (_snapshotCache[file]) {
      _snapshotCache[file] = false;
    }
    var zip = _exercise.getSrcZip({ compression: 'DEFLATE' });
    var metadata = { cause: cause, file: file };
    var snapshot = new TMCWebClient.snapshot(_exercise, 'code_snapshot', zip, metadata);
    _spyware.add(snapshot);
  }

  function createOutputContainer() {
    _output = new TMCWebClient.output(_container);
  }

  function createResetHandler() {
    $('.actions .reset', _container).click(function() {
      _exercise.reset();
      _files = _exercise.getFilesFromSource();

      _filename = _files[0].name;
      var content = _exercise.getFile(_filename).asText();
      _editor.setValue(content);
      createMarkers(_filename);
      _editor.moveCursorTo(0, 0);
      $('.tab-bar li', _container).removeClass('active');
      $('.tab-bar li', _container).first().addClass('active');
    });
  }

  function createShareHandler() {
    $('.actions .share', _container).first().click(shareOnClickHandler);
  }

  function shareOnClickHandler() {
    var button = $('.actions .share i', _container);
    button.parent().prop("disabled", true);
    var text = button.parent().find('.button-text');
    var originalText = text.text();
    text.text('Jaetaan...');
    button.addClass('fa-spin');
    saveActiveFile();
    generateFullSnapshot(_filename, 'file_change', true);

    _exercise.share(function (data) {
      var urlParts = data.paste_url.split('/');
      var pasteKey = urlParts[urlParts.length - 1];
      // TODO: Move baseUrl somewhere else
      var baseUrl = 'https://ohjelmointikurssi.github.io/paste/?key=';
      var shareUrl = baseUrl + pasteKey;
      _output.showShare(shareUrl);
      button.removeClass('fa-spin');
      button.parent().prop("disabled", false);
      text.text(originalText);
    }, function (data) {
      _output.close();
      console.log(data);
    });

    var data = TMCWebClient.snapshot.prototype.generateBase64Json({ command: 'tmc-web-client.share' });
    _spyware.add(new TMCWebClient.snapshot(_exercise, 'project_action', data));
  }
  var _errors = new Set();

  var _messages = [];
  var _code;
  function createRunHandler() {
    $('.actions .run', _container).first().click(function () {
      var gameFrame = document.getElementById('game-frame-' + _exercise.id);
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
          _messages.push(e.data.message);
          _output.render(_messages);
        }
        if (e.data.error) {
          stopGame();
          _errors.add(e.data.error);
          _output.renderError(_errors);
        }
        if (e.data.stop) {
          stopGame();
        }
      }
    });
  }

  function runCode() {
    _messages = [];
    _errors = new Set();
    var gameFrame = document.getElementById('game-frame-' + _exercise.id)

    var code = Object.getOwnPropertyNames(_exercise.getFiles()).filter(function (o) {
      return o.endsWith('.js') && !o.endsWith('test.js');
    }).sort()
    .map(function (o) {
      return _exercise.getFiles()[o].asText();
    }).join('\n');

    // Check if the exercise is a game related exercise
    var gameFiles = Object.getOwnPropertyNames(_exercise.getFiles()).filter(function (o) {
      return o.endsWith('update.js');
    });

    var isGame = gameFiles.length > 0;

    if (isGame) {
      $('#game-area-' + _exercise.id).html('');
      $('#game-frame-' + _exercise.id).removeClass('inactive');
      $('#background-overlay').addClass('active');
      $('body').addClass('overlay-open');
    }

    var codeTemplate = Handlebars.templates.Code({ code: code, exerciseId: _exercise.id, isGame: isGame})
    var gameTemplate = Handlebars.templates.Game({ id: _exercise.id, code: code });
    gameFrame.src = 'data:text/html;charset=utf-8,' + encodeURI(gameTemplate);
    _code = codeTemplate;
    // In case this is not the first run
    _gameFrameReady = false;
    waitForGameIframe();
  }

  var _gameFrameReady = false;
  function waitForGameIframe() {
    var gameFrame = document.getElementById('game-frame-' + _exercise.id);
    // var url = (window.location != window.parent.location) ? document.referrer: document.location;

    if (_gameFrameReady) {
      gameFrame.contentWindow.postMessage(_code, '*');
      console.info('Sent the code to be executed');
    } else {
      console.info('Asking if the frame is ready.');
      gameFrame.contentWindow.postMessage('ready', '*');
      window.setTimeout(waitForGameIframe, 100);
    }
  }

  function stopGame() {
    $('#background-overlay').removeClass('active');
    $('body').removeClass('overlay-open');
    $('#game-frame-' + _exercise.id).addClass('inactive');
    // This should kill all the remaining processes
    var gameFrame = document.getElementById('game-frame-' + _exercise.id);
    gameFrame.src = '';
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
    };
  }

  function render(files) {
    var attributes = {
      title: _exercise.getName(),
      files: files,
    };

    // Render editor
    $(_container).prepend(_template.editor(attributes));

    _navBar = $('.tab-bar', _container).first();

    _offsetLeftFix = $('li', _navBar)[0].offsetLeft;

    // Add click events to tabs
    $('li', _navBar).click(tabClick);

    createShareHandler();
    createResetHandler();
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
      handleKeyboard: function(data, hash, key, keyCode) {
        // In case of race condition
        if (_rangesNeedupdating) {
          createMarkers(_filename);
        }
        if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) {
          return false;
        }
        if (editingProtectedArea()) {
          return { command: 'null', passEvent: false };
        }
        if (keyCode === 13 || keyCode === 8 || keyCode === 46) {
          _rangesNeedupdating = true;
        }
      },
    });
    preventEvent('onPaste');
    preventEvent('onCut');
  }

  function preventEvent(methodName) {
    var orig = _editor[methodName];
    _editor[methodName] = function() {
      var args = Array.prototype.slice.call(arguments);
      if (editingProtectedArea()) {
        return undefined;
      }
      var originalReturn = orig.apply(_editor, args);
      createMarkers(_filename);
      return originalReturn;
    };
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

  function setFileMode(filename) {
    var modes = {
      c: 'c_cpp',
      css: 'css',
      h: 'c_cpp',
      htm: 'html',
      html: 'html',
      java: 'java',
      js: 'javascript',
      json: 'json',
      rb: 'ruby',
      xml: 'xml',
      yml: 'yaml',
      py: 'python',
    };

    // Fallback to text
    var mode = 'text';
    // Get filename extension
    var fileExtension = _exercise.getFileExtension(filename);
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

  function initialize() {
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
      var files = _exercise.getFilesFromSource();

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
      _editor.on('change', saveToLocalStorageHandler);
    });
    createOutputContainer();
  }

  initialize();
};
