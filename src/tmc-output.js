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

TMCWebClient.output.prototype.processing = function () {

    this.clear();
    this._outputContainer.show();
    this._outputContainer.html('<p>Processing...</p>');
}

TMCWebClient.output.prototype.showResults = function (results) {

    this.clear();

    /* jshint camelcase: false */
    var attributes = {

        status: results.status,
        tests: results.test_cases

    }
    /* jshint camelcase: true */

    this._outputContainer.append(this._template.output(attributes));
}
