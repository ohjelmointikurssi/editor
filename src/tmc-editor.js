TMCWebClient.editor = function (container, exercise) {

    var _template = {

            editor: Handlebars.templates.Editor

        },

        _container = container,
        _editor,
        _output,
        _intervalId,
        _exercise = exercise;

    function configure(editor) {

        // Editor
        editor.setPrintMarginColumn(false);
        editor.setDisplayIndentGuides(false);
        editor.getSession().setFoldStyle('markbeginend');

        // Text
        editor.setTheme('ace/theme/light');
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
        _exercise.fetchZip(function () {

            var files = _exercise.getFilesFromSource(),
                content = files[0].asText();

            // Render
            render(files);
            show(content);

            // Set active tab
            $(_container).find('.tab-bar li').first().addClass('active');
        });

        createOutputContainer();
    }

    function createOutputContainer() {

        _output = new TMCWebClient.output(_container);
    }

    function createSubmitHandler() {

        $(_container).find('.actions .submit').first().click(submitOnClickHandler);
    }

    function submitOnClickHandler() {

        clearInterval(_intervalId);

        _output.process();
        saveActiveFile();

        _exercise.submit(function (data) {

            /* jshint camelcase:false */
            submissionPoller(data.submission_url);
            /* jshint camelcase:true */
        });
    }

    function submissionPoller(submissionUrl) {

        var intervalId = setInterval(function () {

            $.ajax(submissionUrl, {

                beforeSend: TMCWebClient.xhrBasicAuthentication,
                dataType: 'json',

                error: function (data) {

                    clearInterval(intervalId);
                    console.log(data);
                },

                success: function (data) {

                    if (data.status !== 'processing') {
                        clearInterval(intervalId);
                        showResults(data);
                    } else {
                        console.log(data.status);
                    }
                }
            });
        }, 3000);

        _intervalId = intervalId;
    }

    function showResults(data) {

        console.log(data);
        _output.showResults(data);
    }

    function render(files) {

        var attributes = {

            title: _exercise.getName(),
            files: files

        }

        // Render editor
        $(_container).prepend(_template.editor(attributes));

        // Add click events to tabs
        $(_container).find('.tab-bar li').click(changeFile);

        createSubmitHandler();
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

        saveActiveFile();

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

    function saveActiveFile() {

        var filename = $('.tmc-exercise .tab-bar li.active').attr('data-id');
        _exercise.saveFile(filename, _editor.getValue());
    }

    initialise();
}
