TMCWebClient.spyware = (function () {

    var _module = {},
        _snapshots = [];

    _module.add = function (snapshot) {

        _snapshots.push(snapshot);
    }

    _module.submit = function () {

        var old = _snapshots;
        _snapshots = [];

        console.log(JSON.stringify(old));

        // TODO: Get a real server
        $.post('http://gzip.josalmi.fi/', {

            // TODO: Get this url from courses.json
            url: 'http://hy.spyware.testmycode.net',
            data: JSON.stringify(old),
            username: TMCWebClient.session.getUsername(),
            password: TMCWebClient.session.getPassword()
        
        });
    }

    return _module;
})();
