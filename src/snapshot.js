export default class Snapshot {
  constructor(exercise, action, data, metadata) {
    this.courseName = exercise.getCourseName();
    this.exerciseName = exercise.getExerciseName();
    this.eventType = this.getEventType(action);
    this.data = data;
    if (metadata !== undefined) {
      this.metadata = JSON.stringify(metadata);
    }
    this.happenedAt = Date.now();
    this.systemNanotime = Math.round(window.performance.now());
  }

  getEventType(action) {
    const actions = {
      insertText: 'text_insert',
      insertLines: 'text_insert',
      removeText: 'text_remove',
      removeLines: 'text_remove',
    };
    return actions[action] || action;
  }

  generatePatchData(name, oldData, newData, document) {
    return Snapshot.generateBase64Json({
      file: name,
      patches: this.generatePatch(oldData, newData),
      full_document: document,
    });
  }

  static generateBase64Json(obj) {
    return btoa(JSON.stringify(obj));
  }

  generatePatch(oldData, newData) {
    /* eslint-disable */
    const dmp = new diff_match_patch();

    const diff = dmp.diff_main(oldData, newData, true);

    if (diff.length > 2) {
      dmp.diff_cleanupSemantic(diff);
    }

    const patchList = dmp.patch_make(oldData, newData, diff);
    return dmp.patch_toText(patchList);
    /* eslint-enable */
  }
}
