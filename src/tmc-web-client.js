require('!css!sass!./css/tmc-web-client.sass');

import $ from 'jquery';
import Exercise from './exercise.js';
import Editor from './editor.js';
import Session from './session.js';
import Paste from './paste.js';
import ExerciseTemplate from './templates/Exercise.template';

export default class TMCWebClient {
  findExerciseContainers() {
    return $('[data-type="tmc-exercise"]');
  }

  initializeEditors(containers) {
    this.addBackgroundOverlay();
    containers.each((index, container) => {
      const id = $(container).data('id');
      const exerciseTemplate = ExerciseTemplate({ id });

      $(container).replaceWith(exerciseTemplate);
      const editorContainer = $(`#exercise-${id} .tmc-exercise`);
      const exercise = new Exercise(id);

      exercise.fetch(() => {
        // Create editor
        /* eslint-disable no-unused-vars */
        const editor = new Editor(editorContainer, exercise);
        /* eslint-enable no-unused-vars */
      });
    });
  }

  initializeLogoutHandler() {
    $('body')
      .find('.tmc-exercise-logout')
      .first()
      .click(Session.logout);
  }

  addBackgroundOverlay() {
    const body = document.querySelector('body');
    const overlay = document.createElement('div');
    overlay.id = 'background-overlay';
    body.appendChild(overlay);
  }

  initialize() {
    Session.login(() => {
      this.initializeEditors(this.findExerciseContainers());
      this.initializeLogoutHandler();
    });
  }

  initializePaste() {
    this.addBackgroundOverlay();
    Session.login(() => {
      // init paste
      let container = $('#tmc-paste');
      const paramParts = window.location.search.split('=');
      if (paramParts.length !== 2) {
        console.error('Unable to parse url parameters.');
        return;
      }
      const pasteKey = paramParts[1];
      const paste = new Paste(pasteKey);
      paste.fetch(() => {
        const zip = paste.getZip();
        const exercise = paste.exercise;
        exercise.fetch(() => {
          exercise.setZip(zip);
          const exerciseTemplate = ExerciseTemplate({ id: exercise.id });
          $(container).append(exerciseTemplate).children();
          container = $(`#exercise-${exercise.id} .tmc-exercise`);
          /* eslint-disable no-unused-vars */
          const editor = new Editor(container, exercise);
          /* eslint-enable no-unused-vars */
        });
      });
      this.initializeLogoutHandler();
    });
  }
}
