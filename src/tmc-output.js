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
        tests: results.test_cases

    }
    /* jshint camelcase: true */

    this.render(attributes);
}
