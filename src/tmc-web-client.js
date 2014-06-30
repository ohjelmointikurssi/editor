/* exported TMCWebClient */

var TMCWebClient = (function() {

    var _module = {

        server: 'http://tmc-kesapojat.jamo.io',
        apiVersion: 7

    };

    function findExerciseContainers() {

        return $('[data-type="tmc-exercise"]');
    }

    function initialiseEditors(containers) {

        containers.each(function (index, container) {

            $(container).addClass('tmc-exercise');

            var exercise = new _module.exercise($(container).data('id'));

            exercise.fetch(function() {

                // Create editor
                new _module.editor(container, exercise);
            });
        });
    }

    function initialiseLogoutButton() {

        $('body').find('.logout').first().click(TMCWebClient.session.logout);
    }

    _module.initialise = function () {

        _module.session.login(function() {
            
            initialiseEditors(findExerciseContainers());
            initialiseLogoutButton();
        });
    }

    _module.getAuthenticationToken = function () {

        return btoa(encodeURIComponent(_module.session.getUsername()) + ':' + encodeURIComponent(_module.session.getPassword()));
    }

    _module.xhrBasicAuthentication = function (xhr) {

        xhr.setRequestHeader('Authorization', 'Basic ' + TMCWebClient.getAuthenticationToken());
    }

    return _module;
})();
