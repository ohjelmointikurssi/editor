/* exported TMCWebClient */

var TMCWebClient = (function() {

    var _module = {

        server: 'http://tmc-kesapojat.jamo.io',
        apiVersion: 7

    };

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initialiseEditors(containers) {

        containers.each(function (index, container) {

            $(container).addClass('tmc-exercise');

            var exercise = new _module.exercise($(container).data('id'));

            exercise.fetch(function() {

                // Create editor
                new _module.editor(container, exercise);
            });
        });
    }

    _module.initialise = function () {

        initialiseEditors(findExerciseContainers());
    }

    _module.getAuthenticationToken = function () {

        return btoa('webclient:tmc-webclient');
    }

    _module.xhrBasicAuthentication = function (xhr) {

        xhr.setRequestHeader('Authorization', 'Basic ' + TMCWebClient.getAuthenticationToken());
    }

    return _module;
})();
