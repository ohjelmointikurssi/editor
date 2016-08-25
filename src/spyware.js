import $ from 'jquery';
import Session from './session.js';

export default class Spyware {
  constructor(exercise) {
    this.exercise = exercise;
    this.snapshots = [];
    this.timedSubmit(0.5 * 60 * 1000);
  }

  add(snapshot) {
    this.snapshots.push(snapshot);
  }

  submit() {
    return;
    const old = this.snapshots;
    this.snapshots = [];

    if (old.length === 0) {
      return;
    }
    // TODO: Get a real server
    $.post('http://gzip.josalmi.fi/', {
      // TODO: Get this url from courses.json
      url: 'http://staging.spyware.testmycode.net',
      data: JSON.stringify(old),
      username: Session.getUsername(),
      password: Session.getPassword(),
    });
  }

  timedSubmit(interval) {
    setInterval(this.submit.bind(this), interval);
  }
}
