import Session from './session.js';

export default class Authentication {
  static getAuthenticationToken() {
    const username = window.atob('dGhyb3dhd2F5LWY0ZTRiOWQw');
    const password = window.atob('OFlHajF1dzhOSEdlbmVqbGV0eHM=');
    return btoa(`${encodeURIComponent(username)}:${encodeURIComponent(password)}`);
  }

  static xhrBasicAuthentication(xhr) {
    xhr.setRequestHeader('Authorization', `Basic ${Authentication.getAuthenticationToken()}`);
  }
}
