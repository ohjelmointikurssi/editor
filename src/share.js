import Snapshot from './snapshot.js';
import $ from 'jquery';

export default class Share {
  constructor(container, editor, exercise, spyware, output) {
    this.editor = editor;
    this.exercise = exercise;
    this.spyware = spyware;
    this.container = container;
    this.output = output;
    this.button = $('.actions .share', this.container).first();
    this.baseUrl = 'https://ohjelmointikurssi.github.io/paste/?key=';
  }

  handleClicks() {
    this.button.click(this.shareOnClickHandler.bind(this));
  }

  shareOnClickHandler() {
    const button = $('.actions .share i', this.container);
    button.parent().prop('disabled', true);
    const text = button.parent().find('.button-text');
    const originalText = text.text();
    text.text('Jaetaan...');
    button.addClass('fa-spin');
    this.editor.saveActiveFile();
    this.editor.generateFullSnapshot(this.filename, 'file_change', true);

    this.exercise.share((data) => {
      const urlParts = data.paste_url.split('/');
      const pasteKey = urlParts[urlParts.length - 1];
      const shareUrl = this.baseUrl + pasteKey;
      this.output.showShare(shareUrl);
      button.removeClass('fa-spin');
      button.parent().prop('disabled', false);
      text.text(originalText);
    }, () => {
      this.output.close();
    });

    const data = Snapshot.generateBase64Json({ command: 'tmc-web-client.share' });
    this.spyware.add(new Snapshot(this.exercise, 'project_action', data));
  }
}
