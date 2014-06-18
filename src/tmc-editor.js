TMCWebClient.editor = function (container, exercise) {

    var _template = Handlebars.templates.EditorFilebrowser;
    var _container = container;

    function configure(editor) {

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
    }

    function render(files) {

        $(_container).append(_template({ files: files }));
    }

    function init(exercise) {

        var editorContainer = $('<div/>').addClass('tmc-exercise');
        $(_container).append(editorContainer);

        var editor = ace.edit(editorContainer.get(0));

        configure(editor);

        exercise.fetch(function () {

            var files = exercise.getFilesFromSource();

            render(files);

            var content = files[0].asText();
            editor.setValue(content);

            editor.getSelection().clearSelection();
            editor.moveCursorTo(0, 0);
            editor.getSession().setScrollTop(0);
        });
    }

    init(exercise);
}
