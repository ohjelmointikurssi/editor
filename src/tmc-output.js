TMCWebClient.output = function (container) {

    this._template = {

        output: Handlebars.templates.OutputContainer

    }

    // Create container for submission results
    this._outputContainer = $('<div/>').addClass('tmc-output').hide();
    $(container).append(this._outputContainer);
}

TMCWebClient.output.prototype.render = function (attributes) {

    this.clear();

    var self = this,
        html = $(this._template.output(attributes));

    // Close handler
    html.find('.close').click(function () {

        self.close();
    });

    this._outputContainer.append(html);
    this._outputContainer.show();
}

TMCWebClient.output.prototype.clear = function () {

    this._outputContainer.empty();
}

TMCWebClient.output.prototype.close = function () {

    this._outputContainer.hide();
}

TMCWebClient.output.prototype.processing = function () {

    this.render();
}

TMCWebClient.output.prototype.showResults = function (results) {

    /* jshint camelcase: false */
    var attributes = {

        status: results.status,
        passed: results.all_tests_passed,
        tests: results.test_cases,
        validations: this.validations(results.validations),
        ratio: this.calculateProgress(results.test_cases)

    }
    /* jshint camelcase: true */

    this.render(attributes);
}

TMCWebClient.output.prototype.calculateProgress = function (tests) {

    var passed = 0;
    var failed = 0;

    tests.forEach(function (test) {

        test.successful ? passed++ : failed++;
    });

    return {

        pass: passed / tests.length * 100,
        fail: failed / tests.length * 100

    }
}

TMCWebClient.output.prototype.validations = function (validations) {

    if (!validations.validationErrors) {
        return null;
    }

    var validationMessages = validations.validationErrors;

    var array = [];

    for (var key in validationMessages) {

        var validation = {};

        validation.name = key;
        validation.messages = [];

        var obj = validationMessages[key];

        for (var prop in obj) {

            // Important check that this is objects own property
            if (obj.hasOwnProperty(prop)) {
                validation.messages.push(obj[prop]);
            }
        }

        array.push(validation);
    }

    return array;
}
