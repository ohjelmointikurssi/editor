TMCWebClient.exercise = function (id) {

    this._baseUrl = TMCWebClient.server + '/exercises/';
    this._id = id;
}

TMCWebClient.exercise.prototype.fetch = function (callback) {

    if (this.exercise !== undefined) {
        callback();
        return;
    }

    var self = this;

    $.ajax({

        beforeSend: TMCWebClient.xhrBasicAuthentication,

        data: {

            'api_version': TMCWebClient.apiVersion

        },

        success: function(exercise) {

            self._exercise = exercise;
            callback();
        },

        url: this._baseUrl + this._id + '.json'
    });
}

TMCWebClient.exercise.prototype.downloadZip = function(url, callback) {

    JSZipUtils.getBinaryContent(url, function(error, data) {

        if (error) {
            throw error;
        }

        callback(new JSZip(data));
    });
}

TMCWebClient.exercise.prototype.fetchZip = function(callback) {

    var self = this;

    this.downloadZip(this._baseUrl + this._id + '.zip', function(zip) {

        self._zip = zip;

        callback();
    });
}

TMCWebClient.exercise.prototype.submit = function(callback) {

    if (this._zip === undefined) {
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
        url: this._baseUrl + this._id + '/submissions.json',
        beforeSend: TMCWebClient.xhrBasicAuthentication,
        success: callback

    });
}

TMCWebClient.exercise.prototype.fetchLastSubmission = function(callback, fallback) {

    if (this._lastSubmission === undefined && this._exercise.submissions.length === 0) {
        fallback();
        return;
    }

    if (this._lastSubmission !== undefined) {
        callback(this._lastSubmission);
        return;
    }

    var self = this;

    var data = {
        'api_version': TMCWebClient.apiVersion
    }

    $.ajax({
        data: data,
        url: TMCWebClient.server + '/submissions/' + this._exercise.submissions[0].id + '.json',
        beforeSend: TMCWebClient.xhrBasicAuthentication,
        
        success: function(data) {

            if (data.status === 'processing') {
                console.log('Submission not ready');
                fallback();
                return;
            }
            self._lastSubmission = data;
            callback(self._lastSubmission); 
        }
    });
}

TMCWebClient.exercise.prototype.getName = function () {

    /* jshint camelcase: false */
    return this._exercise.exercise_name;
    /* jshint camelcase: true */
}

TMCWebClient.exercise.prototype.getZipBlob = function () {

    return this._zip.generate({ type: 'blob' });
}

TMCWebClient.exercise.prototype.getFiles = function () {

    return this._zip.files;
}

TMCWebClient.exercise.prototype.getFile = function (filename) {

    return this._zip.file(filename);
}

TMCWebClient.exercise.prototype.getFilesFromSource = function () {

    return this._zip.file(/\/src(?!\/\.).*/);
}

TMCWebClient.exercise.prototype.saveFile = function (filename, content) {

    this._zip.file(filename, content);
}

TMCWebClient.exercise.prototype.setLastSubmission = function(lastSubmission) {
    
    this._lastSubmission = lastSubmission;
};
