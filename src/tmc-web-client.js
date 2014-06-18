/* exported TMCWebClient */

var TMCWebClient = (function () {

    var _module = {};

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initEditors(containers) {

        var container = containers[0];
        $(container).addClass('tmc-exercise');

        new _module.editor(container, new _module.exercise($(container).data('id')));
    }

    _module.init = function () {

        initEditors(findExerciseContainers());
    }

    return _module;
})();
