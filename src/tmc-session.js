TMCWebClient.session = (function () {
  var _template = {
    login: Handlebars.templates.Login,
  };

  var _module = {
    username: localStorage.username,
    password: localStorage.password,
  };

  _module.logout = function () {
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    _module.username = undefined;
    _module.password = undefined;
    _module.login($.noop);
  };

  _module.login = function (callback) {
    if (_module.username !== undefined && _module.password !== undefined) {
      callback();
      return;
    }

    var form = $(_template.login({ username: _module.username }));
    var status = $('.status', form);

    $('form', form).submit(function () {
      var formData = $('form', form).serialize();
      var username = $('.username', form).val();
      var password = $('.password', form).val();

      status.text('');

      $.post(TMCWebClient.server + '/auth.text', formData, function (data) {
        if (data === 'OK') {
          form.remove();
          _module.username = localStorage.username = username;
          _module.password = localStorage.password = password;
          callback();
        } else {
          status.text('Wrong username or password!');
        }
      });

      return false;
    });

    $('body').append(form);
  };

  _module.getUsername = function () {
    return _module.username;
  };

  _module.getPassword = function () {
    return _module.password;
  };

  return _module;
})();
