require('./css/tmc-web-client.sass');

import 'babel-polyfill';
import $ from 'jquery';
import Exercise from './exercise.js';
import Editor from './editor.js';
import Session from './session.js';
import Paste from './paste.js';
import exerciseTemplate from './templates/Exercise.template';

export default class WebClient {
  static findExerciseContainers() {
    return $('[data-type="tmc-exercise"]').toArray();
  }

  static async initializeEditor(container) {
    const id = $(container).data('id');
    const exerciseString = exerciseTemplate({ id });

    $(container).replaceWith(exerciseString);
    const editorContainer = $(`#exercise-${id}`).find('.tmc-exercise');
    const exercise = new Exercise(id);

    await exercise.fetch();
    const editor = new Editor(editorContainer, exercise);
    editor.start();
  }

  static initializeLogoutHandler() {
    $('body')
      .find('.tmc-exercise-logout')
      .first()
      .click(Session.logout);
  }

  static addBackgroundOverlay() {
    const body = document.querySelector('body');
    const overlay = document.createElement('div');
    overlay.id = 'background-overlay';
    body.appendChild(overlay);
  }

  static async initialize() {
    this.addBackgroundOverlay();
    await Session.login();
    this.initializeLogoutHandler();
    this.findExerciseContainers().forEach(this.initializeEditor);
  }

  static async initializePaste() {
    this.addBackgroundOverlay();
    this.initializeLogoutHandler();
    await Session.login();
    // init paste
    let container = $('#tmc-paste');
    const paramParts = window.location.search.split('=');
    if (paramParts.length !== 2) {
      console.error('Unable to parse url parameters.');
      return;
    }
    const pasteKey = paramParts[1];
    const paste = new Paste(pasteKey);

    await paste.fetch();
    const zip = paste.getZip();
    const exercise = paste.exercise;

    await exercise.fetch();
    exercise.setZip(zip);
    const exerciseString = exerciseTemplate({ id: exercise.id });
    $(container).append(exerciseString).children();
    container = $(`#exercise-${exercise.id}`).find('.tmc-exercise');
    const editor = new Editor(container, exercise);
    editor.start();
  }
}

window.TMCWebClient = WebClient;
