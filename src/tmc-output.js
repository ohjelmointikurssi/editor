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

TMCWebClient.output.prototype.visible = function () {

    return this._outputContainer.is(':visible');
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
        validations: this.getValidations(results.validations),
        ratio: this.calculateProgress(results.test_cases)

    }
    /* jshint camelcase: true */

    this.render(attributes);

    this.createTestResultsHandler();
    this.createValidationResultsHandler();
}

TMCWebClient.output.prototype.calculateProgress = function (tests) {

    var passed = 0;
    var failed = 0;

    tests.forEach(function (test) {

        test.successful ? passed++ : failed++;
    });

    return {

        passed: passed,
        failed: failed,
        total: tests.length

    }
}

TMCWebClient.output.prototype.getValidations = function (validations) {

    if (!validations.validationErrors) {
        return null;
    }

    var validationMessages = validations.validationErrors;

    // Number of validation errors
    var errorCount = 0;

    // Array containing all validation objects
    var array = [];

    var statistics = {

        results: array,
        errorCount: errorCount

    }

    this.buildValidations(statistics, validationMessages);

    return statistics;
}

TMCWebClient.output.prototype.buildValidations = function (validations, validationMessages) {

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

        validations.errorCount += validation.messages.length;

        validations.results.push(validation);
    }
}

TMCWebClient.output.prototype.createTestResultsHandler = function () {

    var self = this;

    this._outputContainer.find('.results .test-results').first().click(function () {

        self.detailedTestResultsOnClickHandler();
    });
}

TMCWebClient.output.prototype.detailedTestResultsOnClickHandler = function () {

    var element = this._outputContainer.find('.results .test-results .details');

    element.toggle();
}

TMCWebClient.output.prototype.createValidationResultsHandler = function () {

    var self = this;

    this._outputContainer.find('.results .validation-results').first().click(function () {

        self.detailedValidationResultsOnClickHandler();
    });
}

TMCWebClient.output.prototype.detailedValidationResultsOnClickHandler = function () {

    var element = this._outputContainer.find('.results .validation-results .details');

    element.toggle();
}
