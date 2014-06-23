/* exported TMCWebClient */

var TMCWebClient = (function () {

    var _module = {};

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initialiseEditors(containers) {

        containers.each(function () {

            $(this).addClass('tmc-exercise');

            // Create editor
            new _module.editor(this, new _module.exercise($(this).data('id')));
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
