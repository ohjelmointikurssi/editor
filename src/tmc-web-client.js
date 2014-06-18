/* exported TMCWebClient */

var TMCWebClient = (function () {

    var _module = {};

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initialiseEditors(containers) {

        // Get exercise container
        var container = containers[0];
        $(container).addClass('tmc-exercise');

        // Create editor
        new _module.editor(container, new _module.exercise($(container).data('id')));
    }

    _module.initialise = function () {

        initialiseEditors(findExerciseContainers());
    }

    return _module;
})();
