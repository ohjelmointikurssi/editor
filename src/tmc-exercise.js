TMCWebClient.exercise = function (id) {
  this.baseUrl = TMCWebClient.server + '/exercises/';
  this.id = id;
};

TMCWebClient.exercise.prototype.fetch = function (callback) {
  if (this.exercise !== undefined) {
    callback();
    return;
  }

  var self = this;

  $.ajax({
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    data: {
      api_version: TMCWebClient.apiVersion,
    },
    success: function (exercise) {
      self.exercise = exercise;
      callback();
    },
    url: this.baseUrl + this.id + '.json',
  });
};

TMCWebClient.exercise.prototype.localStorageKey = function () {
  if (this.exercise === undefined) {
    throw("Cannot determine local storage key without exercise metadata");
  }
  var courseName = this.exercise.course_name;
  var exerciseName = this.exercise.exercise_name;
  return courseName + "-" + exerciseName;
}

TMCWebClient.exercise.prototype.storeCodeToLocalStorage = function () {
  var self = this;
  if (this.exercise === undefined) {
    throw("Cannot use local storage without exercise metadata");
  }
  var currentFiles = {};
  Object.getOwnPropertyNames(this.getFiles()).filter(function (o) {
    return o.endsWith('.js') && !o.endsWith('test.js');
  }).sort()
  .forEach(function (o) {
    currentFiles[o] = self.zip.files[o].asText();
  });
  localStorage[this.localStorageKey()] = JSON.stringify(currentFiles);
}

TMCWebClient.exercise.prototype.restoreCodeFromLocalStorage = function () {
  var self = this;
  if (this.exercise === undefined) {
    throw("Cannot use local storage without exercise metadata");
  }
  if (!localStorage[this.localStorageKey()]) {
    return;
  }
  localStorageFiles = JSON.parse(localStorage[this.localStorageKey()]);
  Object.getOwnPropertyNames(localStorageFiles).forEach(function (filename) {
    self.zip.file(filename, localStorageFiles[filename]);
  });
}

TMCWebClient.exercise.prototype.downloadZip = function (url, callback) {
  JSZipUtils.getBinaryContent(url, function (error, data) {
    if (error) {
      throw error;
    }

    callback(new JSZip(data));
  });
};

TMCWebClient.exercise.prototype.setZip = function (zip) {
  this.zip = zip;
  this.getSourcePath();
  this.storeOriginalZip(zip);
};

TMCWebClient.exercise.prototype.fetchZip = function (callback) {
  if (this.zip) {
    callback();
    return;
  }
  var localStorageValue = localStorage[this.localStorageKey()];
  if (localStorageValue !== undefined) {

  }
  var self = this;
  this.downloadZip(this.baseUrl + this.id + '.zip', function (zip) {
    self.zip = zip;
    self.getSourcePath();
    self.storeOriginalZip(zip);
    self.restoreCodeFromLocalStorage();
    self.storeCodeToLocalStorage();
    callback();
  });
};

TMCWebClient.exercise.prototype.storeOriginalZip = function (zip) {
  var newZip = new JSZip();
  zip.file(/.*/).forEach(function(file) {
    newZip.file(file.name, file.asText());
  });
  this.originalZip = newZip;
};

TMCWebClient.exercise.prototype.reset = function () {
  var newZip = new JSZip();
  this.originalZip.file(/.*/).forEach(function(file) {
    newZip.file(file.name, file.asText());
  });
  this.zip = newZip;
  this.sourcePath = null;
  this.getSourcePath();
};

TMCWebClient.exercise.prototype.submit = function (callback, fallback) {
  if (this.zip === undefined) {
    return;
  }

  var formData = new FormData();
  formData.append('api_version', TMCWebClient.apiVersion);
  formData.append('commit', 'Submit');
  formData.append('submission[file]', this.getZipBlob());

  $.ajax({
    data: formData,
    type: 'POST',
    processData: false,
    contentType: false,
    url: this.baseUrl + this.id + '/submissions.json',
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    success: callback,
    error: fallback,
  });
};

TMCWebClient.exercise.prototype.share = function (callback, fallback) {
  if (this.zip === undefined) {
    return;
  }

  var formData = new FormData();
  formData.append('api_version', TMCWebClient.apiVersion);
  formData.append('commit', 'Submit');
  formData.append('submission[file]', this.getZipBlob());

  $.ajax({
    data: formData,
    type: 'POST',
    processData: false,
    contentType: false,
    url: this.baseUrl + this.id + '/submissions.json?paste=1',
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    success: callback,
    error: fallback,
  });
};

TMCWebClient.exercise.prototype.fetchLastSubmission = function (callback, error, processing) {
  if (this.lastSubmission !== undefined) {
    callback(this.lastSubmission);
    return;
  }

  if (this.exercise.submissions.length === 0) {
    error();
    return;
  }

  var self = this;
  var id = this.exercise.submissions[0].id;
  var url = TMCWebClient.server + '/submissions/' +
    id + '.json?api_version=' + TMCWebClient.apiVersion;

  $.ajax({
    url: url,
    beforeSend: TMCWebClient.xhrBasicAuthentication,

    success: function (data) {
      if (data.status === 'processing') {
        processing(url);
        return;
      }
      self.lastSubmission = data;
      callback(self.lastSubmission);
    },
  });
};

TMCWebClient.exercise.prototype.getName = function () {
  var exerciseName = this.exercise.exercise_name;

  return exerciseName.substring(exerciseName.lastIndexOf('.') + 1);
};

TMCWebClient.exercise.prototype.getExerciseName = function() {
  return this.exercise.exercise_name;
};


TMCWebClient.exercise.prototype.getCourseName = function() {
  return this.exercise.course_name;
};

TMCWebClient.exercise.prototype.getSourcePath = function () {
  if (this.sourcePath) {
    return this.sourcePath;
  }

  var name = this.getFilesFromSource()[0].name.split('/');
  name.pop();
  // TODO: This is bad
  /* eslint-disable no-return-assign */
  return this.sourcePath = name.join('/');
  /* eslint-enable no-return-assign */
};

TMCWebClient.exercise.prototype.getZipBlob = function () {
  return this.getZip({ type: 'blob' });
};

TMCWebClient.exercise.prototype.getZip = function (args) {
  return this.zip.generate(args);
};

TMCWebClient.exercise.prototype.getSrcZip = function (args) {
  var zip = new JSZip();
  this.getFilesFromSource().forEach(function(file) {
    zip.file(file.name, file.asText());
  });
  return zip.generate(args);
};

TMCWebClient.exercise.prototype.getFiles = function () {
  return this.zip.files;
};

TMCWebClient.exercise.prototype.getFile = function (filename) {
  return this.zip.file(filename);
};

TMCWebClient.exercise.prototype.getFilesFromSource = function () {
  return this.zip.file(/src(?!\/\.).*/);
};

TMCWebClient.exercise.prototype.getFileExtension = function(filename) {
  // We want no path to mess this thing
  var lastSlashIndex = filename.lastIndexOf('/');

  if (lastSlashIndex !== -1) {
    /* eslint-disable no-param-reassign */
    filename = filename.substring(lastSlashIndex + 1);
    /* eslint-enable no-param-reassign */
  }

  // Can determine filename extension
  var lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    var filenameExtension = filename.substring(lastDotIndex + 1);

    return filenameExtension;
  }
};

TMCWebClient.exercise.prototype.getLockedRegions = function (filename) {
  var regions = [];

  var input = this.zip.file(filename).asText().split('\n');

  for (var i = 0; i < input.length; i++) {
    if (input[i].indexOf('// START LOCK') > -1) {
      for (var j = i; j < input.length; j++) {
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
};

TMCWebClient.exercise.prototype.getFileLength = function (filename) {
  if (filename === undefined) {
    console.warn('Filename is undefined');
    return -1;
  }
  var input = this.zip.file(filename).asText().split('\n');
  return input.length;
};

TMCWebClient.exercise.prototype.saveFile = function (filename, content) {
  this.zip.file(filename, content);
};

TMCWebClient.exercise.prototype.removeFile = function (filename) {
  this.zip.remove(filename);
};

TMCWebClient.exercise.prototype.setLastSubmission = function (lastSubmission) {
  this.lastSubmission = lastSubmission;
};
