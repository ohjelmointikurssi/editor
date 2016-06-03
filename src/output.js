import $ from 'jquery';
import Clipboard from 'clipboard';
import OutputContainerTemplate from './templates/OutputContainer.template';
import shareOutputContainerTemplate from './templates/ShareOutputContainer.template';
import outputErrorContainerTemplate from './templates/OutputErrorContainer.template';

export default class Output {
  constructor(container) {
    this.template = {
      output: OutputContainerTemplate,
      error: outputErrorContainerTemplate,
    };

    // Create container for submission results
    this.outputContainer = $('<div/>').addClass('tmc-output').addClass('hidden');
    this.wrapper = $('<div/>').addClass('tmc-output-wrapper').addClass('hidden');
    this.wrapper.append(this.outputContainer);
    $(container).append(this.wrapper);
  }

  render(text, template) {
    this.clear();

    const newTemplate = template || this.template.output;
    const html = $(newTemplate({ lines: text }));

    // Close handler
    html.find('.close').click(() => {
      this.close();
    });

    this.outputContainer.append(html);
    this.wrapper.removeClass('hidden');
    this.outputContainer.removeClass('hidden');
  }

  renderError(errors) {
    this.clear();

    const html = $(outputErrorContainerTemplate({ messages: Array.from(errors) }));

    // Close handler
    html.find('.close').click(() => {
      this.close();
    });

    this.outputContainer.append(html);
    this.wrapper.removeClass('hidden');
    this.outputContainer.removeClass('hidden');
  }

  renderShare(shareUrl) {
    this.clear();

    const newTemplate = shareOutputContainerTemplate;
    const html = $(newTemplate({ link_url: shareUrl }));

    // Close handler
    html.find('.close').click(() => {
      this.close();
    });

    // Clipboard copy handler
    /* eslint-disable no-new */
    new Clipboard('.copy-btn');
    /* eslint-enable no-new */

    this.outputContainer.append(html);
    this.outputContainer.removeClass('hidden');
    this.wrapper.removeClass('hidden');
  }

  clear() {
    this.outputContainer.empty();
  }

  visible() {
    return this.outputContainer.is(':visible');
  }

  close() {
    this.outputContainer.addClass('hidden');
    this.wrapper.addClass('hidden');
  }

  processing() {
    this.render();
  }

  showShare(shareUrl) {
    this.renderShare(shareUrl);
  }

  showResults(results) {
    // Build errored
    if (results.status === 'error') {
      return this.showError(results);
    }

    const attr = {
      status: results.status,
      passed: results.all_tests_passed,
      tests: results.test_cases,
      validations: this.getValidations(results.validations),
      ratio: this.calculateProgress(results.test_cases),
      submissionUrl: results.submission_url,

    };

    this.render(attr);

    this.createResultHandlers(attr.ratio, attr.validations);
    return undefined;
  }

  showError(results) {
    const attr = {
      error: results.error,
    };
    this.render(attr, this.template.error);
  }

  calculateProgress(tests) {
    let passed = 0;
    let failed = 0;

    // Count how many tests passed or failed
    tests.forEach((test) => {
      if (test.successful) {
        passed++;
      } else {
        failed++;
      }
    });

    return {
      passed,
      failed,
      total: tests.length,
    };
  }

  getValidations(validations) {
    if (!validations.validationErrors) {
      return null;
    }

    const validationMessages = validations.validationErrors;

    // Number of validation errors
    const errorCount = 0;

    // Array containing all validation objects
    const array = [];

    const statistics = {
      results: array,
      errorCount,
    };

    this.buildValidations(statistics, validationMessages);

    return statistics;
  }

  buildValidations(validations, validationMessages) {
    /* eslint-disable */
    for (const key in validationMessages) {
      const validation = {};

      validation.name = key;
      validation.messages = [];

      const obj = validationMessages[key];

      for (const prop in obj) {
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
    /* eslint-enable */
  }

  createResultHandlers(tests, validations) {
    if (tests.failed !== 0) {
      this.createTestResultsHandler();
    }

    if (validations.errorCount !== 0) {
      this.createValidationResultsHandler();
    }
  }

  createTestResultsHandler() {
    const element = this.outputContainer.find('.results .test-results');

    element.addClass('active');
    element.click(() => {
      this.detailedTestResultsOnClickHandler();
    });
  }

  detailedTestResultsOnClickHandler() {
    // Toggle validation results
    this.outputContainer.find('.results .validation-results').toggle();

    // Toggle detailed information about test results
    this.outputContainer.find('.results .test-results').toggleClass('extended');
    this.outputContainer.find('.results .test-results .details').toggle();
  }

  createValidationResultsHandler() {
    const element = this.outputContainer.find('.results .validation-results');

    element.addClass('active');
    element.click(() => {
      this.detailedValidationResultsOnClickHandler();
    });
  }

  detailedValidationResultsOnClickHandler() {
    // Toggle test results
    this.outputContainer.find('.results .test-results').toggle();

    // Toggle detailed information about validation results
    this.outputContainer.find('.results .validation-results').toggleClass('extended');
    this.outputContainer.find('.results .validation-results .details').toggle();
  }
}
