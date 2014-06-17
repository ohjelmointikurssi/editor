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
        new _module.editor(editorContainer.get(0));
    }

    _module.init = function () {

        console.log('Ready!');
        initEditors(findExerciseContainers());
    }

    return _module;
})();
