import $ from 'jquery';
import Clipboard from 'clipboard';
import OutputContainerTemplate from './templates/OutputContainer.template';
import shareOutputContainerTemplate from './templates/ShareOutputContainer.template';

export default class Output {
  constructor(container, id) {
    this.id = id;
    // Create container for submission results
    this.outputContainer = $('<div/>').addClass('tmc-output').addClass('hidden');
    this.wrapper = $('<div/>').addClass('tmc-output-wrapper').addClass('hidden');
    this.wrapper.append(this.outputContainer);
    $(container).append(this.wrapper);

    var gameArea = document.getElementById(`game-${this.id}`);
    this.hintContainer = gameArea.querySelector('.game-hint');
  }

  render(text) {
    const templateOptions = {
      lines: text,
      title: 'Ohjelman tulostus'
    };
    this._render(templateOptions);
  }

  renderError(errors) {
    const templateOptions = {
      lines: Array.from(errors),
      title: 'Korjaa koodistasi syntaksivirheet',
    };
    this._render(templateOptions);
  }

  _render(templateOptions) {
    this.templateOptions = templateOptions;
    templateOptions.hint = this.hint;
    templateOptions.passed = this.passed;
    this.clear();

    const html = $(OutputContainerTemplate(templateOptions));
    // Close handler
    html.find('.close').click(() => {
      this.close();
    });

    this.outputContainer.append(html);
    this.wrapper.removeClass('hidden');
    this.outputContainer.removeClass('hidden');
  }

  _renderGameHint() {
    // We don't want to show the hint right away
    const hintIcon = '<i class="fa fa-lightbulb-o" aria-hidden="true"></i>';
    window.setTimeout(() => {
      this.hintContainer.innerHTML = hintIcon + this.hint;
    }, 5000);
  }

  addHint(hint, isGame) {
    this.hint = hint;
    if (isGame) {
      this._renderGameHint();
    } else {
      this._render(this.templateOptions);
    }
  }

  addCompleteMessage(isGame) {
    if (isGame) {
      const hintIcon = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
      window.setTimeout(() => {
        this.hintContainer.innerHTML = hintIcon + 'Tehtävä meni läpi.';
      }, 5000);
    }
  }

  addPassed() {
    this.passed = true;
    this._render(this.templateOptions);
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
    this.hintContainer.textContent = '';
  }

  clearMetadata() {
    this.hint = undefined;
    this.passed = false;
  }

  close() {
    this.outputContainer.addClass('hidden');
    this.wrapper.addClass('hidden');
  }

  showShare(shareUrl) {
    this.renderShare(shareUrl);
  }

}
