TMCWebClient.editor = function (container, exercise) {

    var _template = {

            editor: Handlebars.templates.Editor

        },

        _container = container,
        _navBar,
        _offsetLeftFix = 0,
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
        editor.setFontSize(13);
        editor.getSession().setTabSize(4);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setWrapLimitRange(90, 90);
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
            setFileMode(files[0].name);
            show(content);

            // Set active tab
            $('.tab-bar li', _container).first().addClass('active');
        });

        createOutputContainer();
    }

    function createOutputContainer() {

        _output = new TMCWebClient.output(_container);
    }

    function createSubmitHandler() {

        $('.actions .submit', _container).first().click(submitOnClickHandler);
    }

    function submitOnClickHandler() {

        clearInterval(_intervalId);
        saveActiveFile();

        processingSubmission(true);
        _output.processing();

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

                        _exercise.setLastSubmission(data);

                        processingSubmission(false);
                        showResults(data);
                    }
                }
            });
        }, 3000);

        _intervalId = intervalId;
    }

    function processingSubmission(state) {

        var submitElement = $('.actions .submit', _container).first();

        if (!state) {
            submitElement.removeClass('pulse');
            return;
        }

        submitElement.addClass('pulse');
    }

    function showResults(data) {

        _output.showResults(data);
    }

    function createLastSubmissionHandler() {

        $('.actions .output', _container).first().click(function () {

            // Toggle output
            if (_output.visible()) {

                _output.close();
                return;
            }

            _output.processing();
            _exercise.fetchLastSubmission(function (data) {

                showResults(data);

            }, function() {

                submitOnClickHandler();

            }, function(submissionUrl) {

                submissionPoller(submissionUrl);
            });
        });
    }

    function createNewFileHandler() {

        $('.actions .new', _container).first().click(function () {

            var path = _exercise.getSourcePath();
            var classname = prompt('Filename:');

            setFileMode(classname);

            // Save new file
            _exercise.saveFile(path + '/' + classname, 'public class ' + classname.split('.')[0] + ' { }');

            // Update navigation bar
            update();
        });
    }

    function createDeleteFileHandler() {

        $('.top .tab-bar li i.delete', _container).each(function (index, element) {

            // Get file id
            var id = $(element).parent().attr('data-id');

            $(element).click(function () {

                // Remove file
                _exercise.removeFile(id);

                // If currently active tab equals deleted file, clear editor
                if ($('.top .tab-bar li.active', _container).attr('data-id') === id) {
                    _editor.setValue('');
                }

                // Update navigation bar
                update();
            });
        });
    }

    function update() {

        // Delete navigation bar
        $('.top', _container).remove();

        // Render navigation bar
        render(_exercise.getFilesFromSource());

        // Set active tab
        $('.tab-bar li', _container).last().click();
    }

    function render(files) {

        var attributes = {

            title: _exercise.getName(),
            files: files

        }

        // Render editor
        $(_container).prepend(_template.editor(attributes));

        _navBar = $('.tab-bar', _container).first();

        _offsetLeftFix = $('li', _navBar)[0].offsetLeft;

        // Add click events to tabs
        $('li', _navBar).click(changeFile);

        createSubmitHandler();
        createLastSubmissionHandler();
        createNewFileHandler();
        createDeleteFileHandler();
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
        $('.tab-bar li', _container).removeClass('active');

        // Set active tab
        element.addClass('active');

        scrollToTab(element);

        // File
        var filename = element.attr('data-id'),
            content = _exercise.getFile(filename).asText();

        setFileMode(filename);

        show(content);
    }

    function scrollToTab(element) {

        _navBar[0].scrollLeft = element[0].offsetLeft - _offsetLeftFix - _navBar.width() / 2 + element.width() / 2;
    }

    function setFileMode(filename) {

        var modes = {

            'c':    'c_cpp',
            'css':  'css',
            'h':    'c_cpp',
            'htm':  'html',
            'html': 'html',
            'java': 'java',
            'js':   'javascript',
            'json': 'json',
            'rb':   'ruby',
            'xml':  'xml',
            'yml':  'yaml'

        },

        // Fallback to text
        mode = 'text';

        // Can determine filename extension
        var lastDotIndex = filename.lastIndexOf('.');

        if (lastDotIndex !== -1 && lastDotIndex !== 0) {

            var filenameExtension = filename.substring(lastDotIndex + 1);

            // Set mode or fallback to text if no mode is specified for the filename extension
            mode = modes[filenameExtension] || mode;
        }

        _editor.getSession().setMode('ace/mode/' + mode);
    }

    function saveActiveFile() {

        var filename = $('.top .tab-bar li.active', _container).attr('data-id');
        _exercise.saveFile(filename, _editor.getValue());
    }

    initialise();
}
