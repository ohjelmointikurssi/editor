var TMCWebClient = (function() {
  var _module = {
    server: 'https://tmc.mooc.fi/staging',
    apiVersion: 7,
  };

  function findExerciseContainers() {
    return $('[data-type="tmc-exercise"]');
  }

  function initialiseEditors(containers) {
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

  _module.initialise = function () {
    _module.session.login(function() {
      initialiseEditors(findExerciseContainers());
      initialiseLogoutHandler();
    });
  };

  _module.initializePaste = function () {
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
