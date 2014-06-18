TMCWebClient.exercise = function (id) {

    this.baseUrl = 'http://tmc-kesapojat.jamo.io/exercises/';
    this.id = id;
}

TMCWebClient.exercise.prototype.fetch = function (callback) {

    var self = this;

    // Fetch exercise as zip
    JSZipUtils.getBinaryContent(this.baseUrl + this.id + '.zip', function (error, data) {

        if (error) {
            throw error;
        }

        self.zip = new JSZip(data);

        callback();
    });
}

TMCWebClient.exercise.prototype.submit = function (callback) {

    if (this.zip === undefined) {
        return;
    }

    var formData = new FormData();
    formData.append('api_version', 7);
    formData.append('commit', 'Submit');
    formData.append('submission[file]', this.getZipBlob());

    $.ajax({
        data: formData,
        type: 'POST',
        processData: false,
        contentType: false,
        url: this.baseUrl + this.id + '/submissions.json',
        username: 'webclient',
        password: 'tmc-webclient',
        beforeSend: TMCWebClient.xhrBasicAuthentication,
        success: callback
    });

}

TMCWebClient.exercise.prototype.getZipBlob = function () {

    return this.zip.generate({type: 'blob'});
}

TMCWebClient.exercise.prototype.getFiles = function () {

    return this.zip.files;
}

TMCWebClient.exercise.prototype.getFile = function (filename) {

    return this.zip.file(filename);
}

TMCWebClient.exercise.prototype.getFilesFromSource = function() {

    return this.zip.file(/\/src(?!\/\.).*/);
}
