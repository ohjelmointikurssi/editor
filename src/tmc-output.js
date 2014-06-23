TMCWebClient.output = function (container) {

    this._template = {

        output: Handlebars.templates.OutputContainer

    }

    // Create container for submission results
    this._outputContainer = $('<div/>');

    this._outputContainer.addClass('tmc-output');

    $(container).append(this._outputContainer);
}

TMCWebClient.output.prototype.showResults = function (results) {

    /* jshint camelcase: false */
    var attributes = {

        status: results.status,
        tests: results.test_cases

    }
    /* jshint camelcase: true */

    this._outputContainer.append(this._template.output(attributes));
}

TMCWebClient.output.prototype.clear = function () {

    this._outputContainer.empty();
}
