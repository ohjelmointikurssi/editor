import Session from './session.js';

export default class Authentication {
  static getAuthenticationToken() {
    const username = Session.getUsername();
    const password = Session.getPassword();
    return btoa(`${encodeURIComponent(username)}:${encodeURIComponent(password)}`);
  }

  static xhrBasicAuthentication(xhr) {
    xhr.setRequestHeader('Authorization', `Basic ${Authentication.getAuthenticationToken()}`);
  }
}
