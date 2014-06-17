TMCWebClient.exercise = function (id) {

    this.id = id;
}

TMCWebClient.exercise.prototype.getContent = function (callback) {

    JSZipUtils.getBinaryContent('http://tmc.josalmi.fi/' + this.id + '.zip', function (error, data) {

        if (error) {
            throw error;
        }

        var zip = new JSZip(data);

        callback(zip.file('viikko1/Viikko1_001.Nimi/src/Nimi.java').asText());
    });
}
