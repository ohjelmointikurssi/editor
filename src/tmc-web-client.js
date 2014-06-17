/* exported TMCWebClient */

var TMCWebClient = (function () {

    var _module = {};

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initEditors(containers) {

        var container = containers[0],
            editorContainer = $('<div/>').addClass('tmc-exercise');

        $(container).append(editorContainer);

        new _module.editor(editorContainer.get(0), new _module.exercise($(container).data('id')));
    }

    _module.init = function () {

        initEditors(findExerciseContainers());
    }

    return _module;
})();
