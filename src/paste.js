import $ from 'jquery';
import Constants from './constants.js';
import Exercise from './exercise.js';
import JSZip from 'jszip';
import Authentication from './authentication.js';

export default class Paste {
  constructor(id) {
    this.baseUrl = `${Constants.server}/paste`;
    this.id = id;
  }

  fetch(callback) {
    if (this.exercise !== undefined) {
      callback();
      return;
    }

    $.ajax({
      beforeSend: Authentication.xhrBasicAuthentication,
      data: {
        api_version: Constants.apiVersion,
        include_files: 1,
      },
      success: (paste) => {
        this.data = paste;
        const solutionParts = paste.solution_url.split('/');
        const exerciseId = parseInt(solutionParts[solutionParts.length - 2], 10);
        this.exercise = new Exercise(exerciseId);
        this.exercise.fetch(() => {
          callback();
        });
      },
      error: () => {
        console.error('Could not download paste');
      },
      url: `${this.baseUrl}${this.id}.json`,
    });
  }

  // TODO: change file source
  getZip() {
    const zip = new JSZip();
    this.data.files.forEach((file) => {
      zip.file(file.path, file.contents);
    });
    return zip;
  }
}
