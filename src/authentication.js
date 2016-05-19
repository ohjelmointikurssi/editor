export default class Authentication {
  static getAuthenticationToken() {
    const username = Authentication.session.getUsername();
    const password = Authentication.session.getPassword();
    return btoa(`${encodeURIComponent(username)}:${encodeURIComponent(password)}`);
  }

  static xhrBasicAuthentication(xhr) {
    xhr.setRequestHeader('Authorization', `Basic ${Authentication.getAuthenticationToken()}`);
  }
}
