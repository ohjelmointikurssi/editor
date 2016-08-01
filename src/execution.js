import TestRun from './tester/test_run.js';
import codeTemplate from './templates/Code.template';
import gameTemplate from './templates/Game.template';
import $ from 'jquery';

export default class Execution {
  constructor(exercise, output) {
    this.exercise = exercise;
    this.id = this.exercise.id,
    this.output = output;
    this.messages = [];
    this.errors = new Set();
    this.gameFrameReady = false;
    this.gameFrame = document.getElementById(`game-frame-${this.id}`);
    this.files = this.exercise.getFiles();
    this.isGame = Execution.determineIsGame(this.files);
    this.code = this.concatenateFilesToCode(this.files);
  }

  run() {
    this.output.clearMetadata();
    this.gameFrame.src = '';
    // We want to give the iframe an opportunity to reload.
    setTimeout(this.doRun.bind(this), 100);
  }

  doRun() {
    this.startIframeListener();
    if (this.isGame) {
      $(`#game-area-${this.id}`).html('');
      $(`#game-${this.id}`).addClass('active');
      $('#background-overlay').addClass('active');
      $('body').addClass('overlay-open');
    }

    const gameTemplateString = gameTemplate({ id: this.id, code: this.code, isGame: this.isGame });
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
    $(`#game-${this.id}`).removeClass('active');
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
          this.onEvaluationDone();
        }
        if (e.data.stop) {
          this.stopGame();
        }
        if (e.data.evaluationDone) {
          this.onEvaluationDone();
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

  async onEvaluationDone() {
    console.info('Evaluation done.')
    const test_run = new TestRun(this.files);
    const results = await test_run.run();
    const failed = results.failed;
    if (failed.length > 0) {
      this.output.addHint(failed[0].error);
    } else {
      this.output.addPassed();
      this.exercise.setComplete();
    }
  }

  static determineIsGame(files) {
    const gameFiles = Object.getOwnPropertyNames(files)
      .filter(o => o.endsWith('update.js') || o.endsWith('update.hidden.js'));

    return gameFiles.length > 0;
  }
}
