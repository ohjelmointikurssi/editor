TMCWebClient.editor = function (container, exercise) {

    var _template = Handlebars.templates.EditorFilebrowser,
        _container = container,
        _exercise = exercise,
        _editor;

    function configure(editor) {

        // Editor
        editor.setPrintMarginColumn(false);
        editor.setDisplayIndentGuides(false);
        editor.getSession().setFoldStyle('markbeginend');

        // Text
        editor.setTheme('ace/theme/chrome');
        editor.setFontSize(12);
        editor.getSession().setTabSize(4);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setWrapLimitRange(120, 120);
        editor.getSession().setMode('ace/mode/java');
    }

    function changeFile() {

        $('.tmc-exercise .tab-bar li').removeClass('active');

        var element = $(this);
        element.addClass('active');

        var filename = element.attr('data-id'),
            content = _exercise.getFile(filename).asText();

        show(content);
    }

    function render(files) {

        $(_container).prepend(_template({ files: files }));

        $('.tmc-exercise .tab-bar li').click(changeFile);
    }

    function show(content) {

        _editor.setValue(content);

        _editor.getSelection().clearSelection();
        _editor.moveCursorTo(0, 0);
        _editor.getSession().setScrollTop(0);
    }

    function init() {

        var editorContainer = $('<div/>');

        $(_container).append(editorContainer);

        _editor = ace.edit(editorContainer.get(0));
        configure(_editor);

        _exercise.fetch(function () {

            var files = _exercise.getFilesFromSource(),
                content = files[0].asText();

            render(files);
            show(content);

            $('.tmc-exercise .tab-bar li').first().addClass('active');
        });
    }

    init();
}
