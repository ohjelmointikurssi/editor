TMCWebClient.session = (function() {

	var _module = {
		username: localStorage.username,
		password: localStorage.password
	};

	_module.login = function (callback) {

		if (_module.username !== undefined && _module.password !== undefined) {
			callback();
			return;
		}

		var form = $(Handlebars.templates.Login({
			'username': _module.username
		})),
		    status = $('.status', form);



		$('.login-form', form).submit(function() {

			var formData = $('.login-form', form).serialize(),
			    username = $('.username', form).val(),
			    password = $('.password', form).val();


			status.text('');
			$.post(TMCWebClient.server + '/auth.text', formData, function(data) {

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
	}

	_module.getUsername = function() {

		return _module.username;
	}

	_module.getPassword = function() {

		return _module.password;
	}

	return _module;
})();