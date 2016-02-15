TMCWebClient.paste = function initializePaste(id) {
  this.baseUrl = TMCWebClient.server + '/paste/';
  this.id = id;
};

TMCWebClient.paste.prototype.fetch = function fetchPaste(callback) {
  if (this.exercise !== undefined) {
    callback();
    return;
  }

  var self = this;

  $.ajax({
    beforeSend: TMCWebClient.xhrBasicAuthentication,
    data: {
      api_version: TMCWebClient.apiVersion,
      include_files: 1,
    },
    success: function fetchSuccess(paste) {
      self.data = paste;
      var solutionParts = paste.solution_url.split('/');
      var exerciseId = parseInt(solutionParts[solutionParts.length - 2]);
      self.exercise = new TMCWebClient.exercise(exerciseId);
      self.exercise.fetch(function() {
        callback();
      });
    },
    error: function fetchError() {
      console.error('Could not download paste');
    },
    url: this.baseUrl + this.id + '.json',
  });
};

// TODO: change file source
TMCWebClient.paste.prototype.getZip = function () {
  var zip = new JSZip();
  this.data.files.forEach(function(file) {
    zip.file(file.path, file.contents);
  });
  return zip;
};
