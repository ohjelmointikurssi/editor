import $ from 'jquery';
import Constants from './constants.js';
import LoginTemplate from './templates/Login.template';

export default class Session {
  static logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');

    localStorage.username = undefined;
    localStorage.password = undefined;
    this.login($.noop);
  }

  static login(callback) {
    if (localStorage.username !== undefined && localStorage.password !== undefined) {
      callback();
      return;
    }

    const form = $(LoginTemplate({ username: localStorage.username }));
    const status = $('.status', form);

    $('form', form).submit(() => {
      const formData = $('form', form).serialize();
      const username = $('.username', form).val();
      const password = $('.password', form).val();

      status.text('');

      $.post(`${Constants.server}/auth.text`, formData, (data) => {
        if (data === 'OK') {
          form.remove();
          localStorage.username = localStorage.username = username;
          localStorage.password = localStorage.password = password;
          callback();
        } else {
          status.text('Wrong username or password!');
        }
      });

      return false;
    });

    $('body').append(form);
  }

  static getUsername() {
    return localStorage.username;
  }

  static getPassword() {
    return localStorage.password;
  }
}
