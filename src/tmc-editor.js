TMCWebClient.editor = function (container, exercise) {

    var _template = {

            filebrowser: Handlebars.templates.EditorFilebrowser

        },

        _container = container,
        _editor,
        _exercise = exercise;

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

    function initialise() {

        // Create container for editor
        var editorContainer = $('<div/>');

        // Add editor container to container
        $(_container).hide();
        $(_container).append(editorContainer);

        // Create editor
        _editor = ace.edit(editorContainer.get(0));
        configure(_editor);

        // Fetch exercise
        _exercise.fetch(function () {

            var files = _exercise.getFilesFromSource(),
                content = files[0].asText();

            // Render
            render(files);
            show(content);

            // Set active tab
            $(_container).find('.tab-bar li').first().addClass('active');
        });
    }

    function render(files) {

        var attributes = {

            title: files[0].name.split('/')[1],
            files: files

        }

        // Render filebrowser
        $(_container).prepend(_template.filebrowser(attributes));

        // Add click events to tabs
        $(_container).find('.tab-bar li').click(changeFile);
    }

    function show(content) {

        // Show container
        $(_container).show();

        _editor.setValue(content);

        // Clear selection
        _editor.getSelection().clearSelection();
        _editor.moveCursorTo(0, 0);
        _editor.getSession().setScrollTop(0);
    }

    function changeFile() {

        var element = $(this);

        // Clear previous active tab
        $(_container).find('.tab-bar li').removeClass('active');

        // Set active tab
        element.addClass('active');

        // File
        var filename = element.attr('data-id'),
            content = _exercise.getFile(filename).asText();

        show(content);
    }

    initialise();
}
