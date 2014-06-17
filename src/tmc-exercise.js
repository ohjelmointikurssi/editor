TMCWebClient.exercise = function (id) {

    this.baseUrl = 'http://tmc.josalmi.fi/';
    this.id = id;
}

TMCWebClient.exercise.prototype.fetch = function (callback) {

    var self = this;

    JSZipUtils.getBinaryContent(this.baseUrl + this.id + '.zip', function (error, data) {

        if (error) {
            throw error;
        }

        self.zip = new JSZip(data);

        callback();
    });
}

TMCWebClient.exercise.prototype.getFiles = function () {

    return this.zip.files;
}

TMCWebClient.exercise.prototype.getFile = function (filename) {

    return this.zip.file(filename);
}
