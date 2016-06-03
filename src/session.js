import $ from 'jquery';
import Constants from './constants.js';
import loginTemplate from './templates/Login.template';

export default class Session {
  static async logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    await Session.login();
  }

  static login() {
    return new Promise((resolve, reject) => {
      if (localStorage.username !== undefined && localStorage.password !== undefined) {
        resolve();
        return;
      }

      const form = $(loginTemplate({ username: localStorage.username }));
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
            resolve();
          } else {
            status.text('Wrong username or password!');
          }
        });

        return false;
      });

      $('body').append(form);
    });
  }

  static getUsername() {
    return localStorage.username;
  }

  static getPassword() {
    return localStorage.password;
  }
}
