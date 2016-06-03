import codeTemplate from './templates/Code.template';
import gameTemplate from './templates/Game.template';
import $ from 'jquery';

export default class Execution {
  constructor(id, files, output) {
    this.id = id;
    this.output = output;
    this.messages = [];
    this.errors = new Set();
    this.gameFrameReady = false;
    this.gameFrame = document.getElementById(`game-frame-${id}`);

    this.isGame = Execution.determineIsGame(files);
    this.code = this.concatenateFilesToCode(files);
  }

  run() {
    this.gameFrame.src = '';
    // We want to give the iframe an opportunity to reload.
    setTimeout(this.doRun.bind(this), 100);
  }

  doRun() {
    this.startIframeListener();
    if (this.isGame) {
      $(`#game-area-${this.id}`).html('');
      $(`#game-frame-${this.id}`).removeClass('inactive');
      $('#background-overlay').addClass('active');
      $('body').addClass('overlay-open');
    }

    const gameTemplateString = gameTemplate({ id: this.id, code: this.code, isGame: this.isGame.toString() });
    this.gameFrame.src = `data:text/html;charset=utf-8,${encodeURI(gameTemplateString)}`;
    this.createStopGameHandler();
    this.waitForGameIframe();
  }

  waitForGameIframe() {
    if (this.gameFrameReady) {
      this.gameFrame.contentWindow.postMessage(this.code, '*');
      console.info('Sent the code to be executed');
    } else {
      console.info('Asking if the frame is ready.');
      this.gameFrame.contentWindow.postMessage('ready', '*');
      window.setTimeout(this.waitForGameIframe.bind(this), 100);
    }
  }

  createStopGameHandler() {
    $(`#stop-game-${this.id}`).click((e) => {
      e.preventDefault();
      this.stopGame();
    });
  }

  stopGame() {
    $('#background-overlay').removeClass('active');
    $('body').removeClass('overlay-open');
    $(`#game-frame-${this.id}`).addClass('inactive');
    this.stopIframeListener();
    // This should kill all the remaining processes
    this.gameFrame.src = '';
  }

  concatenateFilesToCode(files) {
    const code = Object.getOwnPropertyNames(files)
      .filter(o => o.endsWith('.js') && !o.endsWith('test.js'))
      .sort()
      .map(o => files[o].asText())
      .join('\n');

    return codeTemplate({ code, exerciseId: this.id, isGame: this.isGame });
  }

  startIframeListener() {
    this.iframeListener = ((e) => {
      if (e.data.source === this.id) {
        if (e.data.ready === true) {
          console.info('Setting the game frame to be ready...');
          this.gameFrameReady = true;
        }
        if (e.data.message) {
          this.messages.push(e.data.message);
          this.output.render(this.messages);
        }
        if (e.data.error) {
          this.stopGame();
          this.errors.add(e.data.error);
          this.output.renderError(this.errors);
        }
        if (e.data.stop) {
          this.stopGame();
        }
      }
    });
    window.addEventListener('message', this.iframeListener);
  }

  stopIframeListener() {
    if (this.iframeListener === undefined) {
      throw new Error('There is no iframe listener.');
    }
    window.removeEventListener('message', this.iframeListener);
  }


  static determineIsGame(files) {
    const gameFiles = Object.getOwnPropertyNames(files)
      .filter(o => o.endsWith('update.js') || o.endsWith('update.hidden.js'));

    return gameFiles.length > 0;
  }
}
