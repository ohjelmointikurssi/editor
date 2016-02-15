TMCWebClient.snapshot = function (exercise, action, data, metadata) {
  this.courseName = exercise.getCourseName();
  this.exerciseName = exercise.getExerciseName();
  this.eventType = this.getEventType(action);
  this.data = data;
  if (metadata !== undefined) {
    this.metadata = JSON.stringify(metadata);
  }
  this.happenedAt = Date.now();
  this.systemNanotime = Math.round(window.performance.now());
};

TMCWebClient.snapshot.prototype.getEventType = function (action) {
  var actions = {
    insertText: 'text_insert',
    insertLines: 'text_insert',
    removeText: 'text_remove',
    removeLines: 'text_remove',
  };
  return actions[action] || action;
};

TMCWebClient.snapshot.prototype.generatePatchData = function (name, oldData, newData, document) {
  return this.generateBase64Json({
    file: name,
    patches: this.generatePatch(oldData, newData),
    full_document: document,
  });
};

TMCWebClient.snapshot.prototype.generateBase64Json = function (obj) {
  return btoa(JSON.stringify(obj));
};

TMCWebClient.snapshot.prototype.generatePatch = function (oldData, newData) {
  /* eslint-disable */
  var dmp = new diff_match_patch();

  var diff = dmp.diff_main(oldData, newData, true);

  if (diff.length > 2) {
    dmp.diff_cleanupSemantic(diff);
  }

  var patchList = dmp.patch_make(oldData, newData, diff);
  return dmp.patch_toText(patchList);
  /* eslint-enable */
};
