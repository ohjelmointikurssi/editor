/* exported TMCWebClient */

var TMCWebClient = (function() {

    var _module = {
        server: 'https://tmc.mooc.fi/staging',
        apiVersion: 7
    };

    function findExerciseContainers() {
        return $('[data-type="tmc-exercise"]');
    }

    function initialiseEditors(containers) {
        containers.each(function (index, container) {

            var id = $(container).data('id');
            var exerciseTemplate = Handlebars.templates.Exercise({ id: id });

            $(container).replaceWith(exerciseTemplate);
            container = $('#exercise-' + id + ' .tmc-exercise');
            var exercise = new _module.exercise(id);

            exercise.fetch(function() {
                // Create editor
                var editor = new _module.editor(container, exercise);
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
    }

    _module.initializePaste = function () {
        _module.session.login(function() {
            // init paste
            var container = $('#tmc-paste');
            var param_parts = window.location.search.split('=');
            if (param_parts.length != 2) {
              console.error('Unable to parse url parameters.');
              return;
            }
            var pasteKey = param_parts[1];
            var paste = new _module.paste(pasteKey);
            paste.fetch(function() {
              var zip = paste.getZip();
              var exercise = paste.exercise;
              exercise.fetch(function() {
                exercise.setZip(zip);
                var exerciseTemplate = Handlebars.templates.Exercise({ id: exercise.id });
                $(container).append(exerciseTemplate).children();
                container = $('#exercise-' + exercise.id + ' .tmc-exercise');
                var editor = new _module.editor(container, exercise);
              });
            });
            initialiseLogoutHandler()
        });
    }

    _module.getAuthenticationToken = function () {
        return btoa(encodeURIComponent(_module.session.getUsername()) + ':' + encodeURIComponent(_module.session.getPassword()));
    }

    _module.xhrBasicAuthentication = function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + TMCWebClient.getAuthenticationToken());
    }

    return _module;
})();
