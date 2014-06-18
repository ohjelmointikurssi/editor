/* exported TMCWebClient */

var TMCWebClient = (function () {

    var _module = {};

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initEditors(containers) {

        var container = containers[0];
        var exercise = new _module.exercise($(container).data('id'));

        new _module.editor(container, exercise);
    }

    _module.init = function () {

        initEditors(findExerciseContainers());
    }

    _module.getAuthenticationToken = function () {

        return btoa('webclient:tmc-webclient'); 
    }

    _module.xhrBasicAuthentication = function (xhr) {
        
        xhr.setRequestHeader('Authorization', 'Basic ' + TMCWebClient.getAuthenticationToken()); 
    }

    return _module;
})();
