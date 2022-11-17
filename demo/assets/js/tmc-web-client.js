this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["Editor"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {

  var buffer = "", stack1, helper, options;
  buffer += "\n            <li data-id=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">"
    + escapeExpression((helper = helpers.filename || (depth0 && depth0.filename),options={hash:{},data:data},helper ? helper.call(depth0, (depth0 && depth0.name), options) : helperMissing.call(depth0, "filename", (depth0 && depth0.name), options)))
    + "</li>\n        ";
  return buffer;
  }

  buffer += "<div class='exercise-sidebar'>\n    <h1 class='name'>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n    <ul class='tab-bar'>\n        ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.files) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.files); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.files) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n\n    <section class='actions'>\n      <button class='run' type=\"button\"><i class=\"fa fa-play\"></i><span class='button-text'>Käynnistä</span></button>\n      <button class='reset' type=\"button\"><i class=\"fa fa-undo\"></i><span class='button-text'>Nollaa</span></button>\n    </section>\n    <hr class=\"button-separator\">\n    <section class='actions'>\n      <button class='share' type=\"button\"><i class=\"fa fa-share-alt\"></i><span class='button-text'>Jaa</span></button>\n    </section>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["Exercise"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"exercise-area\" id=\"exercise-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"code-area tmc-exercise\" data-type='tmc-exercise' data-id='";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'></div>\n  <iframe sandbox=\"allow-scripts\" id=\"game-frame-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"game inactive\">\n  </iframe>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["Game"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <title>sandbox</title>\n  <style type=\"text/css\">\n    body {\n      margin: 0;\n    }\n    .game-area {\n      width: 800px;\n      height: 600px;\n    }\n  </style>\n</head>\n\n<body>\n\n<div class=\"game active\" id=\"game-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <a id=\"stop-game\" href=\"#\" title=\"stop-game\" class=\"close\">Pysäytä</a>\n  <div id=\"game-area-";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"game-area\"></div>\n</div>\n\n<script src=\"https://cdn.jsdelivr.net/phaser/2.4.4/phaser.js\"></script>\n\n<script>\n  var _mainWindow = null;\n  console.info('Game frame loaded');\n  //var _url = (window.location != window.parent.location) ? document.referrer: document.location;\n  var _url = '*';\n\n  var sendError = function(message) {\n    var msg = {\n      source: ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ",\n      error: message\n    }\n    if (_mainWindow) {\n      _mainWindow.postMessage(msg, _url);\n    } else {\n      console.warn(\"Unable to display a error message because I don't know who the main window is.\");\n    }\n  }\n\n  var _messageCount = 0;\n  window.addEventListener('message', function(e) {\n    if (_mainWindow === null) {\n      _mainWindow = e.source;\n    }\n    if (e.data == 'ready') {\n      var ready = typeof Phaser !== 'undefined';\n      if (_messageCount > 200) {\n        ready = true;\n      }\n      var msg = {\n        ready: ready,\n        source: ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n      }\n      e.source.postMessage(msg, _url);\n      _messageCount++;\n      return;\n    }\n    // A dirty workaround to mitigate a missing DOMContentLoaded event.\n    if (Phaser.Device._readyCheck) {\n      Phaser.Device._readyCheck();\n    }\n    var showMessage = function(message) {\n      var msg =  {\n        source: ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ",\n        message: message\n      }\n      e.source.postMessage(msg, _url);\n    }\n      try {\n        console.info('Evaluating code...');\n        eval(e.data);\n      } catch (error) {\n        sendError(error.toString());\n      }\n    });\n    document.getElementById('stop-game').addEventListener('click', function() {\n      var msg = {\n        source: ";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ",\n        stop: true\n      }\n      if (_mainWindow) {\n        _mainWindow.postMessage(msg, _url);\n      } else {\n        console.warn(\"Unable to to close the dialog because I don't know who the main window is.\");\n      }\n\n    });\n    window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {\n      if (url === window.location.href) {\n        sendError(errorMsg)\n      }\n    }\n</script>\n</body>\n</html>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["Login"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class='tmc-exercise overlay'></div>\n\n<div class='tmc-exercise login'>\n\n    <h1>TMC</h1>\n\n    <p class='status'></p>\n\n	<form method='post'>\n\n        <div>\n            <label>Username</label>\n            <input class='username' name='username' required value='";
  if (helper = helpers.username) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.username); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n        </div>\n\n        <div>\n            <label>Password</label>\n            <input class='password' name='password' type='password' required>\n        </div>\n\n        <button>Login</button>\n\n	</form>\n\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["OutputContainer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {

  var buffer = "";
  buffer += "\n      <li>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</li>\n    ";
  return buffer;
  }

  buffer += "<section class='output-actions'>\n    <i class='fa fa-close close'></i>\n</section>\n<div class=\"output-content\">\n  <ul class=\"program-output\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.lines), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["OutputErrorContainer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {

  var buffer = "";
  buffer += "\n      <li>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</li>\n    ";
  return buffer;
  }

  buffer += "<section class='output-actions'>\n    <i class='fa fa-close close'></i>\n</section>\n<div class=\"output-content\">\n  <h1 class='title'>Korjaa koodistasi syntaksivirheet.</h1>\n\n  <ul>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.messages), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</div>\n";
  return buffer;
  });

this["Handlebars"]["templates"]["ShareOutputContainer"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<section class='output-actions'>\n  <i class='fa fa-close close'></i>\n</section>\n\n<div class=\"output-content\">\n  <p>Linkki jaettuun koodiin:</p>\n  <input id=\"shared-code-url\" value=";
  if (helper = helpers.link_url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link_url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\n\n  <button class=\"copy-btn\" data-clipboard-target=\"#shared-code-url\">\n      Kopioi osoite\n  </button>\n</div>\n";
  return buffer;
  });;var TMCWebClient = (function() {
  var _module = {
    server: 'https://tmc.mooc.fi/staging',
    apiVersion: 7,
  };

  function findExerciseContainers() {
    return $('[data-type="tmc-exercise"]');
  }

  function initialiseEditors(containers) {
    addBackgroundOverlay();
    containers.each(function (index, container) {
      var id = $(container).data('id');
      var exerciseTemplate = Handlebars.templates.Exercise({ id: id });

      $(container).replaceWith(exerciseTemplate);
      var editorContainer = $('#exercise-' + id + ' .tmc-exercise');
      var exercise = new _module.exercise(id);

      exercise.fetch(function() {
        // Create editor
        /* eslint-disable no-unused-vars */
        var editor = new _module.editor(editorContainer, exercise);
        /* eslint-enable no-unused-vars */
      });
    });
  }

  function initialiseLogoutHandler() {
    $('body').find('.tmc-exercise-logout').first().click(TMCWebClient.session.logout);
  }

  function addBackgroundOverlay() {
    var body = document.querySelector("body");
    var overlay = document.createElement('div');
    overlay.id = "background-overlay";
    body.appendChild(overlay);
  }

  _module.initialise = function () {
    _module.session.login(function() {
      initialiseEditors(findExerciseContainers());
      initialiseLogoutHandler();
    });
  };

  _module.initializePaste = function () {
    addBackgroundOverlay();
    _module.session.login(function() {
      // init paste
      var container = $('#tmc-paste');
      var paramParts = window.location.search.split('=');
      if (paramParts.length !== 2) {
        console.error('Unable to parse url parameters.');
        return;
      }
      var pasteKey = paramParts[1];
      var paste = new _module.paste(pasteKey);
      paste.fetch(function() {
        var zip = paste.getZip();
        var exercise = paste.exercise;
        exercise.fetch(function() {
          exercise.setZip(zip);
          var exerciseTemplate = Handlebars.templates.Exercise({ id: exercise.id });
          $(container).append(exerciseTemplate).children();
          container = $('#exercise-' + exercise.id + ' .tmc-exercise');
          /* eslint-disable no-unused-vars */
          var editor = new _module.editor(container, exercise);
          /* eslint-enable no-unused-vars */
        });
      });
      initialiseLogoutHandler();
    });
  };

  _module.getAuthenticationToken = function () {
    var username = _module.session.getUsername();
    var password = _module.session.getPassword();
    return btoa(encodeURIComponent(username) + ':' + encodeURIComponent(password));
  };

  _module.xhrBasicAuthentication = function (xhr) {
    xhr.setRequestHeader('Authorization', 'Basic ' + TMCWebClient.getAuthenticationToken());
  };

  return _module;
})();
;Handlebars.registerHelper('filename', function(name) {

    return name.split('/').pop();
});
;Handlebars.registerHelper('percentage', function(tests, total) {

    return tests / total * 100;
});
;Handlebars.registerHelper('pluralize', function (value, string) {

    if (value === 1) {
        return string;
    }

    return string + 's';
});
;TMCWebClient.editor = function (container, exercise) {
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
  var _errors = [];

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
    _messages = [];
    _errors = [];
    var gameFrame = document.getElementById('game-frame-' + _exercise.id);
    // TODO: All this should be its own template
    var pre = "(function () { 'use strict'; }()); var console={log: function(a){showMessage(a)}};";

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
      code = "game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-area-' +" + _exercise.id + ', { preload: preload, create: create, update: update });' + code;
      $('#game-area-' + _exercise.id).html('');
      $('#game-frame-' + _exercise.id).removeClass('inactive');
      $('#background-overlay').addClass('active');
      $('body').addClass('overlay-open');
    }
    code += '';
    var gameTemplate = Handlebars.templates.Game({ id: _exercise.id, code: code });
    gameFrame.src = 'data:text/html;charset=utf-8,' + encodeURI(gameTemplate);
    _code = code;
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
      return orig.apply(_editor, args);
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

  function tabClick(arg) {
    debugger;
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
    });
    createOutputContainer();
  }

  initialize();
};
;TMCWebClient.exercise = function (id) {
  this.baseUrl = TMCWebClient.server + '/exercises/';
  this.id = id;
};

TMCWebClient.exercise.prototype.fetch = function (callback) {
  if (this.exercise !== undefined) {
    callback();
    return;
  }

  var self = this;

  $.ajax({
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    data: {
      api_version: TMCWebClient.apiVersion,
    },
    success: function (exercise) {
      self.exercise = exercise;
      callback();
    },
    url: this.baseUrl + this.id + '.json',
  });
};

TMCWebClient.exercise.prototype.downloadZip = function (url, callback) {
  JSZipUtils.getBinaryContent(url, function (error, data) {
    if (error) {
      throw error;
    }

    callback(new JSZip(data));
  });
};

TMCWebClient.exercise.prototype.setZip = function (zip) {
  this.zip = zip;
  this.getSourcePath();
  this.storeOriginalZip(zip);
};

TMCWebClient.exercise.prototype.fetchZip = function (callback) {
  if (this.zip) {
    callback();
    return;
  }
  var self = this;
  this.downloadZip(this.baseUrl + this.id + '.zip', function (zip) {
    self.zip = zip;
    self.getSourcePath();
    self.storeOriginalZip(zip);
    callback();
  });
};

TMCWebClient.exercise.prototype.storeOriginalZip = function (zip) {
  var newZip = new JSZip();
  zip.file(/.*/).forEach(function(file) {
    newZip.file(file.name, file.asText());
  });
  this.originalZip = newZip;
};

TMCWebClient.exercise.prototype.reset = function () {
  var newZip = new JSZip();
  this.originalZip.file(/.*/).forEach(function(file) {
    newZip.file(file.name, file.asText());
  });
  this.zip = newZip;
  this.sourcePath = null;
  this.getSourcePath();
};

TMCWebClient.exercise.prototype.submit = function (callback, fallback) {
  if (this.zip === undefined) {
    return;
  }

  var formData = new FormData();
  formData.append('api_version', TMCWebClient.apiVersion);
  formData.append('commit', 'Submit');
  formData.append('submission[file]', this.getZipBlob());

  $.ajax({
    data: formData,
    type: 'POST',
    processData: false,
    contentType: false,
    url: this.baseUrl + this.id + '/submissions.json',
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    success: callback,
    error: fallback,
  });
};

TMCWebClient.exercise.prototype.share = function (callback, fallback) {
  if (this.zip === undefined) {
    return;
  }

  var formData = new FormData();
  formData.append('api_version', TMCWebClient.apiVersion);
  formData.append('commit', 'Submit');
  formData.append('submission[file]', this.getZipBlob());

  $.ajax({
    data: formData,
    type: 'POST',
    processData: false,
    contentType: false,
    url: this.baseUrl + this.id + '/submissions.json?paste=1',
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    success: callback,
    error: fallback,
  });
};

TMCWebClient.exercise.prototype.fetchLastSubmission = function (callback, error, processing) {
  if (this.lastSubmission !== undefined) {
    callback(this.lastSubmission);
    return;
  }

  if (this.exercise.submissions.length === 0) {
    error();
    return;
  }

  var self = this;
  var id = this.exercise.submissions[0].id;
  var url = TMCWebClient.server + '/submissions/' +
    id + '.json?api_version=' + TMCWebClient.apiVersion;

  $.ajax({
    url: url,
    beforeSend: TMCWebClient.xhrBasicAuthentication,

    success: function (data) {
      if (data.status === 'processing') {
        processing(url);
        return;
      }
      self.lastSubmission = data;
      callback(self.lastSubmission);
    },
  });
};

TMCWebClient.exercise.prototype.getName = function () {
  var exerciseName = this.exercise.exercise_name;

  return exerciseName.substring(exerciseName.lastIndexOf('.') + 1);
};

TMCWebClient.exercise.prototype.getExerciseName = function() {
  return this.exercise.exercise_name;
};


TMCWebClient.exercise.prototype.getCourseName = function() {
  return this.exercise.course_name;
};

TMCWebClient.exercise.prototype.getSourcePath = function () {
  if (this.sourcePath) {
    return this.sourcePath;
  }

  var name = this.getFilesFromSource()[0].name.split('/');
  name.pop();
  // TODO: This is bad
  /* eslint-disable no-return-assign */
  return this.sourcePath = name.join('/');
  /* eslint-enable no-return-assign */
};

TMCWebClient.exercise.prototype.getZipBlob = function () {
  return this.getZip({ type: 'blob' });
};

TMCWebClient.exercise.prototype.getZip = function (args) {
  return this.zip.generate(args);
};

TMCWebClient.exercise.prototype.getSrcZip = function (args) {
  var zip = new JSZip();
  this.getFilesFromSource().forEach(function(file) {
    zip.file(file.name, file.asText());
  });
  return zip.generate(args);
};

TMCWebClient.exercise.prototype.getFiles = function () {
  return this.zip.files;
};

TMCWebClient.exercise.prototype.getFile = function (filename) {
  return this.zip.file(filename);
};

TMCWebClient.exercise.prototype.getFilesFromSource = function () {
  return this.zip.file(/src(?!\/\.).*/);
};

TMCWebClient.exercise.prototype.getFileExtension = function(filename) {
  // We want no path to mess this thing
  var lastSlashIndex = filename.lastIndexOf('/');

  if (lastSlashIndex !== -1) {
    /* eslint-disable no-param-reassign */
    filename = filename.substring(lastSlashIndex + 1);
    /* eslint-enable no-param-reassign */
  }

  // Can determine filename extension
  var lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    var filenameExtension = filename.substring(lastDotIndex + 1);

    return filenameExtension;
  }
};

TMCWebClient.exercise.prototype.getLockedRegions = function (filename) {
  var regions = [];

  var input = this.zip.file(filename).asText().split('\n');

  for (var i = 0; i < input.length; i++) {
    if (input[i].indexOf('// START LOCK') > -1) {
      for (var j = i; j < input.length; j++) {
        if (input[j].indexOf('// END LOCK') > -1) {
          regions.push([i, j]);
          break;
        }
      }
    }
    if (input[i].indexOf('// LOCK FROM BEGINNING') > -1) {
      regions.push([0, i]);
    }
    if (input[i].indexOf('// LOCK TO END') > -1) {
      regions.push([i, input.length - 1]);
    }
  }
  return regions;
};

TMCWebClient.exercise.prototype.getFileLength = function (filename) {
  if (filename === undefined) {
    console.warn('Filename is undefined');
    return -1;
  }
  var input = this.zip.file(filename).asText().split('\n');
  return input.length;
};

TMCWebClient.exercise.prototype.saveFile = function (filename, content) {
  this.zip.file(filename, content);
};

TMCWebClient.exercise.prototype.removeFile = function (filename) {
  this.zip.remove(filename);
};

TMCWebClient.exercise.prototype.setLastSubmission = function (lastSubmission) {
  this.lastSubmission = lastSubmission;
};
;TMCWebClient.output = function (container) {
  this.template = {
    output: Handlebars.templates.OutputContainer,
    error: Handlebars.templates.OutputErrorContainer,
  };

  // Create container for submission results
  this.outputContainer = $('<div/>').addClass('tmc-output').addClass('hidden');
  var wrapper = $('<div/>').addClass('tmc-output-wrapper');
  wrapper.append(this.outputContainer);
  $(container).append(wrapper);
};

TMCWebClient.output.prototype.render = function (text, template) {
  this.clear();

  var self = this;
  var _template = template || this.template.output;
  var html = $(_template({ lines: text }));

  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  this.outputContainer.append(html);
  this.outputContainer.removeClass('hidden');
};

TMCWebClient.output.prototype.renderError = function (errors) {
  this.clear();

  var self = this;
  var _template = Handlebars.templates.OutputErrorContainer;
  var html = $(_template({ messages: errors }));


  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  this.outputContainer.append(html);
  this.outputContainer.removeClass('hidden');
};

TMCWebClient.output.prototype.renderShare = function (shareUrl) {
  this.clear();

  var self = this;
  var _template = Handlebars.templates.ShareOutputContainer;
  var html = $(_template({ link_url: shareUrl }));

  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  // Clipboard copy handler
  /* eslint-disable no-new */
  new Clipboard('.copy-btn');
  /* eslint-enable no-new */

  this.outputContainer.append(html);
  this.outputContainer.removeClass('hidden');
};

TMCWebClient.output.prototype.clear = function () {
  this.outputContainer.empty();
};

TMCWebClient.output.prototype.visible = function () {
  return this.outputContainer.is(':visible');
};

TMCWebClient.output.prototype.close = function () {
  this.outputContainer.addClass('hidden');
};

TMCWebClient.output.prototype.processing = function () {
  this.render();
};

TMCWebClient.output.prototype.showShare = function (shareUrl) {
  this.renderShare(shareUrl);
};

TMCWebClient.output.prototype.showResults = function (results) {
  // Build errored
  if (results.status === 'error') {
    return this.showError(results);
  }

  var attributes = {
    status: results.status,
    passed: results.all_tests_passed,
    tests: results.test_cases,
    validations: this.getValidations(results.validations),
    ratio: this.calculateProgress(results.test_cases),
    submissionUrl: results.submission_url,

  };

  this.render(attributes);

  this.createResultHandlers(attributes.ratio, attributes.validations);
};

TMCWebClient.output.prototype.showError = function (results) {
  var attributes = {
    error: results.error,
  };

  this.render(attributes, this.template.error);
};

TMCWebClient.output.prototype.calculateProgress = function (tests) {
  var passed = 0;
  var failed = 0;

  // Count how many tests passed or failed
  tests.forEach(function (test) {
    if (test.successful) {
      passed++;
    } else {
      failed++;
    }
  });

  return {
    passed: passed,
    failed: failed,
    total: tests.length,
  };
};

TMCWebClient.output.prototype.getValidations = function (validations) {
  if (!validations.validationErrors) {
    return null;
  }

  var validationMessages = validations.validationErrors;

  // Number of validation errors
  var errorCount = 0;

  // Array containing all validation objects
  var array = [];

  var statistics = {
    results: array,
    errorCount: errorCount,
  };

  this.buildValidations(statistics, validationMessages);

  return statistics;
};

TMCWebClient.output.prototype.buildValidations = function (validations, validationMessages) {
  for (var key in validationMessages) {
    var validation = {};

    validation.name = key;
    validation.messages = [];

    var obj = validationMessages[key];

    for (var prop in obj) {
      // Important check that this is object's own property
      if (obj.hasOwnProperty(prop)) {
        validation.messages.push(obj[prop]);
      }
    }
    /* eslint-disable no-param-reassign */
    validations.errorCount += validation.messages.length;
    /* eslint-enable no-param-reassign */

    validations.results.push(validation);
  }
};

TMCWebClient.output.prototype.createResultHandlers = function (tests, validations) {
  if (tests.failed !== 0) {
    this.createTestResultsHandler();
  }

  if (validations.errorCount !== 0) {
    this.createValidationResultsHandler();
  }
};

TMCWebClient.output.prototype.createTestResultsHandler = function () {
  var self = this;
  var element = this.outputContainer.find('.results .test-results');

  element.addClass('active');
  element.click(function () {
    self.detailedTestResultsOnClickHandler();
  });
};

TMCWebClient.output.prototype.detailedTestResultsOnClickHandler = function () {
  // Toggle validation results
  this.outputContainer.find('.results .validation-results').toggle();

  // Toggle detailed information about test results
  this.outputContainer.find('.results .test-results').toggleClass('extended');
  this.outputContainer.find('.results .test-results .details').toggle();
};

TMCWebClient.output.prototype.createValidationResultsHandler = function () {
  var self = this;
  var element = this.outputContainer.find('.results .validation-results');

  element.addClass('active');
  element.click(function () {
    self.detailedValidationResultsOnClickHandler();
  });
};

TMCWebClient.output.prototype.detailedValidationResultsOnClickHandler = function () {
  // Toggle test results
  this.outputContainer.find('.results .test-results').toggle();

  // Toggle detailed information about validation results
  this.outputContainer.find('.results .validation-results').toggleClass('extended');
  this.outputContainer.find('.results .validation-results .details').toggle();
};
;TMCWebClient.paste = function initializePaste(id) {
  this.baseUrl = TMCWebClient.server + '/paste/';
  this.id = id;
};

TMCWebClient.paste.prototype.fetch = function fetchPaste(callback) {
  if (this.exercise !== undefined) {
    callback();
    return;
  }

  var self = this;

  $.ajax({
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    data: {
      api_version: TMCWebClient.apiVersion,
      include_files: 1,
    },
    success: function fetchSuccess(paste) {
      self.data = paste;
      var solutionParts = paste.solution_url.split('/');
      var exerciseId = parseInt(solutionParts[solutionParts.length - 2]);
      self.exercise = new TMCWebClient.exercise(exerciseId);
      self.exercise.fetch(function() {
        callback();
      });
    },
    error: function fetchError() {
      console.error('Could not download paste');
    },
    url: this.baseUrl + this.id + '.json',
  });
};

// TODO: change file source
TMCWebClient.paste.prototype.getZip = function () {
  var zip = new JSZip();
  this.data.files.forEach(function(file) {
    zip.file(file.path, file.contents);
  });
  return zip;
};
;TMCWebClient.session = (function () {
  var _template = {
    login: Handlebars.templates.Login,
  };

  var _module = {
    username: localStorage.username,
    password: localStorage.password,
  };

  _module.logout = function () {
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    _module.username = undefined;
    _module.password = undefined;
    _module.login($.noop);
  };

  _module.login = function (callback) {
    if (_module.username !== undefined && _module.password !== undefined) {
      callback();
      return;
    }

    var form = $(_template.login({ username: _module.username }));
    var status = $('.status', form);

    $('form', form).submit(function () {
      var formData = $('form', form).serialize();
      var username = $('.username', form).val();
      var password = $('.password', form).val();

      status.text('');

      $.post(TMCWebClient.server + '/auth.text', formData, function (data) {
        if (data === 'OK') {
          form.remove();
          _module.username = localStorage.username = username;
          _module.password = localStorage.password = password;
          callback();
        } else {
          status.text('Wrong username or password!');
        }
      });

      return false;
    });

    $('body').append(form);
  };

  _module.getUsername = function () {
    return _module.username;
  };

  _module.getPassword = function () {
    return _module.password;
  };

  return _module;
})();
;TMCWebClient.snapshot = function (exercise, action, data, metadata) {
  this.courseName = exercise.getCourseName();
  this.exerciseName = exercise.getExerciseName();
  this.eventType = this.getEventType(action);
  this.data = data;
  if (metadata !== undefined) {
    this.metadata = JSON.stringify(metadata);
  }
  this.happenedAt = Date.now();
  this.systemNanotime = Math.round(window.performance.now());
};

TMCWebClient.snapshot.prototype.getEventType = function (action) {
  var actions = {
    insertText: 'text_insert',
    insertLines: 'text_insert',
    removeText: 'text_remove',
    removeLines: 'text_remove',
  };
  return actions[action] || action;
};

TMCWebClient.snapshot.prototype.generatePatchData = function (name, oldData, newData, document) {
  return this.generateBase64Json({
    file: name,
    patches: this.generatePatch(oldData, newData),
    full_document: document,
  });
};

TMCWebClient.snapshot.prototype.generateBase64Json = function (obj) {
  return btoa(JSON.stringify(obj));
};

TMCWebClient.snapshot.prototype.generatePatch = function (oldData, newData) {
  /* eslint-disable */
  var dmp = new diff_match_patch();

  var diff = dmp.diff_main(oldData, newData, true);

  if (diff.length > 2) {
    dmp.diff_cleanupSemantic(diff);
  }

  var patchList = dmp.patch_make(oldData, newData, diff);
  return dmp.patch_toText(patchList);
  /* eslint-enable */
};
;TMCWebClient.spyware = function (exercise) {
  this._exercise = exercise;
  this._snapshots = [];
  this.timedSubmit(3 * 60 * 1000);
};

TMCWebClient.spyware.prototype.add = function (snapshot) {
  this._snapshots.push(snapshot);
};

TMCWebClient.spyware.prototype.submit = function () {
  var old = this._snapshots;
  this._snapshots = [];

  if (old.length === 0) {
    return;
  }
  // TODO: Get a real server
  $.post('http://gzip.josalmi.fi/', {
    // TODO: Get this url from courses.json
    url: 'http://staging.spyware.testmycode.net',
    data: JSON.stringify(old),
    username: TMCWebClient.session.getUsername(),
    password: TMCWebClient.session.getPassword(),
  });
};

TMCWebClient.spyware.prototype.timedSubmit = function(interval) {
  setInterval(this.submit.bind(this), interval);
};
