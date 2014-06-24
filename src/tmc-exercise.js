TMCWebClient.exercise = function (id) {

    this.baseUrl = TMCWebClient.server + '/exercises/';
    this.id = id;
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

            self.exercise = exercise;
            callback();
        },

        url: this.baseUrl + this.id + '.json'
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

    this.downloadZip(this.baseUrl + this.id + '.zip', function(zip) {

        self.zip = zip;

        callback();
    });
}

TMCWebClient.exercise.prototype.submit = function(callback) {

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
        success: callback

    });
}

TMCWebClient.exercise.prototype.fetchLastSubmission = function(callback, error, processing) {

    if (this.lastSubmission !== undefined) {
        callback(this.lastSubmission);
        return;
    }

    if (this.exercise.submissions.length === 0) {
        error();
        return;
    }



    var self = this;

    var url = TMCWebClient.server + '/submissions/' + this.exercise.submissions[0].id + '.json?api_version=' + TMCWebClient.apiVersion;

    $.ajax({
        url: url,
        beforeSend: TMCWebClient.xhrBasicAuthentication,

        success: function(data) {

            if (data.status === 'processing') {
                processing(url);
                return;
            }
            self.lastSubmission = data;
            callback(self.lastSubmission);
        }
    });
}

TMCWebClient.exercise.prototype.getName = function () {

    /* jshint camelcase: false */
    return this.exercise.exercise_name;
    /* jshint camelcase: true */
}

TMCWebClient.exercise.prototype.getZipBlob = function () {

    return this.zip.generate({ type: 'blob' });
}

TMCWebClient.exercise.prototype.getFiles = function () {

    return this.zip.files;
}

TMCWebClient.exercise.prototype.getFile = function (filename) {

    return this.zip.file(filename);
}

TMCWebClient.exercise.prototype.getFilesFromSource = function () {

    return this.zip.file(/\/src(?!\/\.).*/);
}

TMCWebClient.exercise.prototype.saveFile = function (filename, content) {

    this.zip.file(filename, content);
}

TMCWebClient.exercise.prototype.setLastSubmission = function(lastSubmission) {

    this.lastSubmission = lastSubmission;
};
