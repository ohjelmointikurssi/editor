import Ace from 'ace';
const Range = Ace.require('ace/range').Range;
import Spyware from './spyware.js';
import $ from 'jquery';
import Snapshot from './snapshot.js';
import Output from './output.js';
import Execution from './execution.js';
import Share from './share.js';
import editorTemplate from './templates/Editor.template';

export default class Editor {
  constructor(container, exercise) {
    this.container = container;
    this.offsetLeftFix = 0;
    this.exercise = exercise;
    this.spyware = new Spyware(exercise);
    this.snapshotCache = {};
    this.folds = [];
    this.markers = [];
    this.lockedRegions = null;
    this.ranges = [];
    this.rangesNeedupdating = false;

    // Create container for editor
    const editorContainer = $('<div/>');

    // Add editor container to container
    $(this.container).hide();

    $(this.container).append(editorContainer);

    // Create editor
    this.editor = Ace.edit(editorContainer.get(0));

    this.configure(this.editor);
    this.createOutputContainer();
  }

  async start() {
    await this.exercise.fetchZip();
    const files = this.exercise.getVisibleFilesFromSource();

    this.filename = files[0].name;
    const content = this.exercise.getFile(this.filename).asText();

    // Render
    this.render(files);
    this.setFileMode(this.filename);
    this.show(content);
    this.createMarkers(this.filename);

    // Set active tab
    $('.tab-bar li', this.container).first().addClass('active');

    this.editor.on('change', this.snapshotHandler.bind(this));
    this.editor.on('change', this.saveToLocalStorageHandler.bind(this));
  }

  configure(editor) {
    // Editor
    editor.setPrintMarginColumn(false);
    editor.setDisplayIndentGuides(false);
    editor.getSession().setFoldStyle('markbeginend');

    // Text
    editor.setTheme('ace/theme/tomorrow');
    editor.setFontSize(13);
    editor.getSession().setTabSize(4);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setWrapLimitRange(90, 90);
    editor.getSession().setMode('ace/mode/javascript');
    editor.getSession().setOption('useWorker', false);

    /* eslint-disable no-param-reassign */
    editor.$blockScrolling = Infinity;
    /* eslint-enable no-param-reassign */
  }

  hideLockMarkers() {
    this.folds.forEach((fold) => {
      this.editor.getSession().removeFold(fold);
    });
    this.lockedRegions.forEach((group) => {
      group.forEach((lockLine) => {
        if (lockLine === 0) {
          return;
        }
        try {
          this.folds.push(this.editor.session.addFold('', new Range(lockLine, 0, lockLine, 900)));
        } catch (e) {
          console.warn('Problems with adding folds');
        }
      });
    });
  }

  createMarkers(filename) {
    this.markers.forEach((marker) => {
      this.editor.getSession().removeMarker(marker);
    });
    this.markers = [];
    this.ranges = [];
    this.lockedRegions = this.exercise.getLockedRegions(filename);
    this.lockedRegions.forEach((limits) => {
      const range = new Range(limits[0], 0, limits[1], 900);
      this.markers.push(this.editor.session.addMarker(range, 'readonly-highlight', 'fullLine'));
      this.ranges.push(range);
    });
    this.hideLockMarkers(filename);
  }

  snapshotHandler(e) {
    if (this.filename === undefined) {
      return;
    }

    const previous = this.exercise.getFile(this.filename).asText();

    if (this.snapshotCache[this.filename] === undefined) {
      const patch = Snapshot.prototype.generatePatchData(this.filename, '', previous, true);
      this.spyware.add(new Snapshot(this.exercise, 'insertText', patch));
    }

    this.spyware.add(new Snapshot(this.exercise, e.action,
      Snapshot.prototype.generatePatchData(this.filename, previous, this.editor.getValue(), false)
    ));
    this.snapshotCache[this.filename] = true;
    this.saveActiveFile();
  }

  saveToLocalStorageHandler() {
    this.exercise.storeCodeToLocalStorage();
  }

  generateFullSnapshot(file, cause, onlyChanged) {
    if (onlyChanged && this.snapshotCache[file] !== true) {
      return;
    }
    if (this.snapshotCache[file]) {
      this.snapshotCache[file] = false;
    }
    const zip = this.exercise.getSrcZip({ compression: 'DEFLATE' });
    const metadata = { cause, file };
    const snapshot = new Snapshot(this.exercise, 'code_snapshot', zip, metadata);
    this.spyware.add(snapshot);
  }

  createOutputContainer() {
    this.output = new Output(this.container);
  }

  createResetHandler() {
    $('.actions .reset', this.container).click(() => {
      this.exercise.reset();
      const files = this.exercise.getVisibleFilesFromSource();

      this.filename = files[0].name;
      const content = this.exercise.getFile(this.filename).asText();
      this.editor.setValue(content);
      this.createMarkers(this.filename);
      this.editor.moveCursorTo(0, 0);
      $('.tab-bar li', this.container).removeClass('active');
      $('.tab-bar li', this.container).first().addClass('active');
    });
  }

  createRunHandler() {
    $('.actions .run', this.container).first().click(() => {
      const execution = new Execution(this.exercise.id, this.exercise.getFiles(), this.output);
      execution.run();
    });
  }

  render(files) {
    const attr = {
      title: this.exercise.getName(),
      files: files.map((f) => {
        const name = f.name.split('/').pop();
        const path = f.name;
        return { name, path };
      }),
    };

    // Render editor
    $(this.container).prepend(editorTemplate(attr));

    this.navBar = $('.tab-bar', this.container).first();

    this.offsetLeftFix = $('li', this.navBar)[0].offsetLeft;

    // Add click events to tabs
    $('li', this.navBar).click(this.tabClick.bind(this));

    const share = new Share(this.container, this, this.exercise, this.spyware, this.output);
    share.handleClicks();
    this.createResetHandler();
    this.createRunHandler();
    this.createKeyboardHandler();
  }

  createKeyboardHandler() {
    this.editor.on('input', () => {
      if (this.rangesNeedupdating) {
        this.createMarkers(this.filename);
      }
    });
    this.editor.keyBinding.addKeyboardHandler({
      handleKeyboard: (data, hash, key, keyCode) => {
        // In case of race condition
        if (this.rangesNeedupdating) {
          this.createMarkers(this.filename);
        }
        if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) {
          return false;
        }
        if (this.editingProtectedArea()) {
          return { command: 'null', passEvent: false };
        }
        if (keyCode === 13 || keyCode === 8 || keyCode === 46) {
          this.rangesNeedupdating = true;
        }
        return undefined;
      },
    });
    this.preventEvent('onPaste');
    this.preventEvent('onCut');
  }

  preventEvent(methodName) {
    const orig = this.editor[methodName];
    this.editor[methodName] = (...args) => {
      if (this.editingProtectedArea()) {
        return undefined;
      }
      const originalReturn = orig.apply(this.editor, args);
      this.createMarkers(this.filename);
      return originalReturn;
    };
  }

  editingProtectedArea() {
    const selection = this.editor.getSelectionRange();
    for (let i = 0; i < this.ranges.length; i++) {
      if (selection.intersects(this.ranges[i])) {
        return true;
      }
    }
    return false;
  }

  show(content) {
    // Show container
    $(this.container).show();

    this.editor.setValue(content);

    // Clear selection
    this.editor.getSelection().clearSelection();
    this.editor.moveCursorTo(0, 0);
    this.editor.getSession().setScrollTop(0);
  }

  tabClick(event) {
    this.saveActiveFile();
    this.generateFullSnapshot(this.filename, 'file_change', true);
    this.clearEditor();
    this.changeFile($(event.toElement));
  }

  changeFile(element) {
    // Clear previous active tab
    $('.tab-bar li', this.container).removeClass('active');
    // Set active tab
    element.addClass('active');
    // this.scrollToTab(element);

    // File
    const filename = element.attr('data-id');
    const content = this.exercise.getFile(filename).asText();
    this.setFileMode(filename);
    this.show(content);
    this.createMarkers(filename);
    this.filename = filename;
  }

  scrollToTab(element) {
    this.navBar[0].scrollLeft = element[0].offsetLeft - this.offsetLeftFix - this.navBar.width() / 2 + element.width() / 2;
  }

  setFileMode(filename) {
    const modes = {
      c: 'c_cpp',
      css: 'css',
      h: 'c_cpp',
      htm: 'html',
      html: 'html',
      java: 'java',
      js: 'javascript',
      json: 'json',
      rb: 'ruby',
      xml: 'xml',
      yml: 'yaml',
      py: 'python',
    };

    // Fallback to text
    let mode = 'text';
    // Get filename extension
    const fileExtension = this.exercise.getFileExtension(filename);
    // Set mode or fallback to text if no mode is specified for the filename extension
    mode = modes[fileExtension] || mode;
    this.editor.getSession().setMode(`ace/mode/${mode}`);
  }

  saveActiveFile() {
    this.exercise.saveFile(this.filename, this.editor.getValue());
  }

  clearEditor() {
    this.filename = undefined;
    this.editor.setValue('');
  }
}
