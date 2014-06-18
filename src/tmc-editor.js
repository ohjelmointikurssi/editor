TMCWebClient.editor = function (container, exercise) {

    function init(container, exercise) {

        var editor = ace.edit(container);

        // Editor
        editor.setPrintMarginColumn(false);
        editor.setDisplayIndentGuides(false);
        editor.getSession().setFoldStyle('markbeginend');

        // Text
        editor.setTheme('ace/theme/chrome');
        editor.setFontSize(14);
        editor.getSession().setTabSize(4);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setWrapLimitRange(120, 120);
        editor.getSession().setMode('ace/mode/java');

        exercise.fetch(function () {

            var files = exercise.getFilesFromSource();

            var content = files[0].asText();
            editor.setValue(content);

            editor.getSelection().clearSelection();
            editor.moveCursorTo(0, 0);
            editor.getSession().setScrollTop(0);
        });
    }

    init(container, exercise);
}
