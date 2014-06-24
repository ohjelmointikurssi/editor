TMCWebClient.output = function (container) {

    this._template = {

        output: Handlebars.templates.OutputContainer

    }

    // Create container for submission results
    this._outputContainer = $('<div/>').hide();

    this._outputContainer.addClass('tmc-output');

    $(container).append(this._outputContainer);
}

TMCWebClient.output.prototype.clear = function () {

    this._outputContainer.empty();
}

TMCWebClient.output.prototype.process = function () {

    this.clear();
    this._outputContainer.show();
    this._outputContainer.html('<p>Processing...</p>');
}

TMCWebClient.output.prototype.showResults = function (results) {

    this.clear();

    /* jshint camelcase: false */
    var attributes = {

        status: results.status,
        tests: results.test_cases,
        ratio: this.progress(results.test_cases)

    }
    /* jshint camelcase: true */

    console.log(attributes.ratio);

    this._outputContainer.append(this._template.output(attributes));
}

TMCWebClient.output.prototype.progress = function (tests) {

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
