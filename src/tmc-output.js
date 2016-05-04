TMCWebClient.output = function (container) {
  this.template = {
    output: Handlebars.templates.OutputContainer,
    error: Handlebars.templates.OutputErrorContainer,
  };

  // Create container for submission results
  this.outputContainer = $('<div/>').addClass('tmc-output').addClass('hidden');
  this.wrapper = $('<div/>').addClass('tmc-output-wrapper').addClass('hidden');
  this.wrapper.append(this.outputContainer);
  $(container).append(this.wrapper);
};

TMCWebClient.output.prototype.render = function (text, template) {
  this.clear();

  var self = this;
  var _template = template || this.template.output;
  var html = $(_template({ lines: text }));

  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  this.outputContainer.append(html);
  this.wrapper.removeClass('hidden');
  this.outputContainer.removeClass('hidden');
};

TMCWebClient.output.prototype.renderError = function (errors) {
  this.clear();

  var self = this;
  var _template = Handlebars.templates.OutputErrorContainer;
  var html = $(_template({ messages: Array.from(errors) }));


  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  this.outputContainer.append(html);
  this.wrapper.removeClass('hidden');
  this.outputContainer.removeClass('hidden');
};

TMCWebClient.output.prototype.renderShare = function (shareUrl) {
  this.clear();

  var self = this;
  var _template = Handlebars.templates.ShareOutputContainer;
  var html = $(_template({ link_url: shareUrl }));

  // Close handler
  html.find('.close').click(function () {
    self.close();
  });

  // Clipboard copy handler
  /* eslint-disable no-new */
  new Clipboard('.copy-btn');
  /* eslint-enable no-new */

  this.outputContainer.append(html);
  this.outputContainer.removeClass('hidden');
  this.wrapper.removeClass('hidden');
};

TMCWebClient.output.prototype.clear = function () {
  this.outputContainer.empty();
};

TMCWebClient.output.prototype.visible = function () {
  return this.outputContainer.is(':visible');
};

TMCWebClient.output.prototype.close = function () {
  this.outputContainer.addClass('hidden');
  this.wrapper.addClass('hidden');
};

TMCWebClient.output.prototype.processing = function () {
  this.render();
};

TMCWebClient.output.prototype.showShare = function (shareUrl) {
  this.renderShare(shareUrl);
};

TMCWebClient.output.prototype.showResults = function (results) {
  // Build errored
  if (results.status === 'error') {
    return this.showError(results);
  }

  var attributes = {
    status: results.status,
    passed: results.all_tests_passed,
    tests: results.test_cases,
    validations: this.getValidations(results.validations),
    ratio: this.calculateProgress(results.test_cases),
    submissionUrl: results.submission_url,

  };

  this.render(attributes);

  this.createResultHandlers(attributes.ratio, attributes.validations);
};

TMCWebClient.output.prototype.showError = function (results) {
  var attributes = {
    error: results.error,
  };
  this.render(attributes, this.template.error);
};

TMCWebClient.output.prototype.calculateProgress = function (tests) {
  var passed = 0;
  var failed = 0;

  // Count how many tests passed or failed
  tests.forEach(function (test) {
    if (test.successful) {
      passed++;
    } else {
      failed++;
    }
  });

  return {
    passed: passed,
    failed: failed,
    total: tests.length,
  };
};

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
    errorCount: errorCount,
  };

  this.buildValidations(statistics, validationMessages);

  return statistics;
};

TMCWebClient.output.prototype.buildValidations = function (validations, validationMessages) {
  for (var key in validationMessages) {
    var validation = {};

    validation.name = key;
    validation.messages = [];

    var obj = validationMessages[key];

    for (var prop in obj) {
      // Important check that this is object's own property
      if (obj.hasOwnProperty(prop)) {
        validation.messages.push(obj[prop]);
      }
    }
    /* eslint-disable no-param-reassign */
    validations.errorCount += validation.messages.length;
    /* eslint-enable no-param-reassign */

    validations.results.push(validation);
  }
};

TMCWebClient.output.prototype.createResultHandlers = function (tests, validations) {
  if (tests.failed !== 0) {
    this.createTestResultsHandler();
  }

  if (validations.errorCount !== 0) {
    this.createValidationResultsHandler();
  }
};

TMCWebClient.output.prototype.createTestResultsHandler = function () {
  var self = this;
  var element = this.outputContainer.find('.results .test-results');

  element.addClass('active');
  element.click(function () {
    self.detailedTestResultsOnClickHandler();
  });
};

TMCWebClient.output.prototype.detailedTestResultsOnClickHandler = function () {
  // Toggle validation results
  this.outputContainer.find('.results .validation-results').toggle();

  // Toggle detailed information about test results
  this.outputContainer.find('.results .test-results').toggleClass('extended');
  this.outputContainer.find('.results .test-results .details').toggle();
};

TMCWebClient.output.prototype.createValidationResultsHandler = function () {
  var self = this;
  var element = this.outputContainer.find('.results .validation-results');

  element.addClass('active');
  element.click(function () {
    self.detailedValidationResultsOnClickHandler();
  });
};

TMCWebClient.output.prototype.detailedValidationResultsOnClickHandler = function () {
  // Toggle test results
  this.outputContainer.find('.results .test-results').toggle();

  // Toggle detailed information about validation results
  this.outputContainer.find('.results .validation-results').toggleClass('extended');
  this.outputContainer.find('.results .validation-results .details').toggle();
};
