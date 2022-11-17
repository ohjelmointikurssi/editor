import Constants from './constants.js';
import $ from 'jquery';
import Authentication from './authentication.js';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

export default class Exercise {
  constructor(id) {
    this.baseUrl = `${Constants.server}/exercises/`;
    this.id = id;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      // For now, we have no need for metadata
      resolve();
      return;
      if (this.exercise !== undefined) {
        resolve();
        return;
      }

      $.ajax({
        beforeSend: Authentication.xhrBasicAuthentication,
        data: {
          api_version: Constants.apiVersion,
        },
        success: (exercise) => {
          this.exercise = exercise;
          resolve();
        },
        url: `${this.baseUrl}${this.id}.json`,
      });
    });
  }

  localStorageKey() {
    const courseName = 'tmc-javascript-course';
    const exerciseName = this.id;
    return `${courseName}-${exerciseName}`;
  }

  storeCodeToLocalStorage() {
    const currentFiles = {};
    let filenames = Object.getOwnPropertyNames(this.getFiles())
      .filter(o => o.endsWith('.js'))
      .filter(o => !o.startsWith('.'));
    if (localStorage.getItem('showall') !== 'true') {
      filenames = filenames.filter(o => !o.endsWith('test.js'));
    }
    filenames
      .sort()
      .forEach((o) => {
        currentFiles[o] = this.zip.files[o].asText();
      });
    localStorage[this.localStorageKey()] = JSON.stringify(currentFiles);
  }

  restoreCodeFromLocalStorage() {
    if (!localStorage[this.localStorageKey()]) {
      return;
    }
    const localStorageFiles = JSON.parse(localStorage[this.localStorageKey()]);
    Object.getOwnPropertyNames(localStorageFiles).forEach((filename) => {
      this.zip.file(filename, localStorageFiles[filename]);
    });
  }

  downloadZip(url) {
    return new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(url, (error, data) => {
        if (error) {
          throw new Error(error);
        }
        const zip = new JSZip(data);
        this.zip = zip;
        this.getSourcePath();
        this.storeOriginalZip(zip);
        this.restoreCodeFromLocalStorage();
        this.storeCodeToLocalStorage();
        resolve();
      });
    });
  }

  setZip(zip) {
    this.zip = zip;
    this.getSourcePath();
    this.storeOriginalZip(zip);
  }

  async fetchZip() {
    return new Promise(async function(resolve, reject) {
      if (this.zip) {
        resolve();
        return;
      }

      await this.downloadZip(`${this.baseUrl}${this.id}.zip`);
      resolve();
    }.bind(this));
  }

  storeOriginalZip(zip) {
    const newZip = new JSZip();
    zip.file(/.*/).forEach((file) => {
      newZip.file(file.name, file.asText());
    });
    this.originalZip = newZip;
  }

  reset() {
    const newZip = new JSZip();
    this.originalZip.file(/.*/).forEach((file) => {
      newZip.file(file.name, file.asText());
    });
    this.zip = newZip;
    this.sourcePath = null;
    this.getSourcePath();
  }

  submit(callback, fallback) {
    if (this.zip === undefined) {
      return;
    }

    const formData = new FormData();
    formData.append('api_version', Constants.apiVersion);
    formData.append('commit', 'Submit');
    formData.append('submission[file]', this.getZipBlob());

    $.ajax({
      data: formData,
      type: 'POST',
      processData: false,
      contentType: false,
      url: `${this.baseUrl}${this.id}/submissions.json`,
      beforeSend: Authentication.xhrBasicAuthentication,
      success: callback,
      error: fallback,
    });
  }

  share(callback, fallback) {
    if (this.zip === undefined) {
      return;
    }

    const formData = new FormData();
    formData.append('api_version', Constants.apiVersion);
    formData.append('commit', 'Submit');
    formData.append('submission[file]', this.getZipBlob());

    $.ajax({
      data: formData,
      type: 'POST',
      processData: false,
      contentType: false,
      url: `${this.baseUrl}${this.id}/submissions.json?paste=1`,
      beforeSend: Authentication.xhrBasicAuthentication,
      success: callback,
      error: fallback,
    });
  }

  getName() {
    return this.getFilesFromSource()[0].name.split('/')[1];
  }

  getShortName() {
    let title = this.getName();
    let index = title.indexOf('-');
    if (index >= 0) {
      title = title.substring(index + 1);
    }
    return title;
  }

  getExerciseName() {
    const nameParts = this.getFilesFromSource()[0].name.split('/');
    return nameParts[0] + nameParts[1];
  }

  getCourseName() {
    return 'javascript-course';
  }

  getSourcePath() {
    if (this.sourcePath) {
      return this.sourcePath;
    }

    const name = this.getFilesFromSource()[0].name.split('/');
    name.pop();
    // TODO: This is bad
    /* eslint-disable no-return-assign */
    return this.sourcePath = name.join('/');
    /* eslint-enable no-return-assign */
  }

  getZipBlob() {
    return this.getZip({ type: 'blob' });
  }

  getZip(args) {
    return this.zip.generate(args);
  }

  getSrcZip(args) {
    const zip = new JSZip();
    this.getFilesFromSource().forEach((file) => {
      zip.file(file.name, file.asText());
    });
    return zip.generate(args);
  }

  getFiles() {
    return this.zip.files;
  }

  getFile(filename) {
    return this.zip.file(filename);
  }

  getAllFilesFromSource() {
    return this.zip.file(/.*\.js$/);
  }

  getFilesFromSource() {
    return this.zip.file(/src(?!\/\.).*/);
  }

  getTestFilesFromSource() {
    return this.zip.file(/test(?!\/\.).*/);
  }

  getVisibleFilesFromSource() {
    return this.getFilesFromSource().filter(o => !o.name.endsWith('.hidden.js'));
  }

  getFileExtension(filename) {
    // We want no path to mess this thing
    const lastSlashIndex = filename.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      /* eslint-disable no-param-reassign */
      filename = filename.substring(lastSlashIndex + 1);
      /* eslint-enable no-param-reassign */
    }

    // Can determine filename extension
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex !== -1 && lastDotIndex !== 0) {
      return filename.substring(lastDotIndex + 1);
    }
    return undefined;
  }

  getLockedRegions(filename) {
    const regions = [];

    const input = this.zip.file(filename).asText().split('\n');

    for (let i = 0; i < input.length; i++) {
      if (input[i].indexOf('// START LOCK') > -1) {
        for (let j = i; j < input.length; j++) {
          if (input[j].indexOf('// END LOCK') > -1) {
            regions.push([i, j]);
            break;
          }
        }
      }
      if (input[i].indexOf('// LOCK FROM BEGINNING') > -1) {
        regions.push([0, i]);
      }
      if (input[i].indexOf('// LOCK TO END') > -1) {
        regions.push([i, input.length - 1]);
      }
    }
    return regions;
  }

  getFileLength(filename) {
    if (filename === undefined) {
      console.warn('Filename is undefined');
      return -1;
    }
    const input = this.zip.file(filename).asText().split('\n');
    return input.length;
  }

  saveFile(filename, content) {
    this.zip.file(filename, content);
  }

  removeFile(filename) {
    this.zip.remove(filename);
  }

  isCompleted() {
    const completionKey = `complete-${this.localStorageKey()}`;
    return localStorage[completionKey] === 'true';
  }

  setComplete() {
    const completionKey = `complete-${this.localStorageKey()}`;
    localStorage[completionKey] = 'true';
    const exerciseContainer = document.getElementById(`exercise-${this.id}`);
    const completionIndicator = exerciseContainer.querySelector('.completion-status');
    completionIndicator.className += ' completed';
  }
}
