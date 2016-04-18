TMCWebClient.spyware = function (exercise) {
  this._exercise = exercise;
  this._snapshots = [];
  this.timedSubmit(0.5 * 60 * 1000);
};

TMCWebClient.spyware.prototype.add = function (snapshot) {
  this._snapshots.push(snapshot);
};

TMCWebClient.spyware.prototype.submit = function () {
  var old = this._snapshots;
  this._snapshots = [];

  if (old.length === 0) {
    return;
  }
  // TODO: Get a real server
  $.post('http://gzip.josalmi.fi/', {
    // TODO: Get this url from courses.json
    url: 'http://staging.spyware.testmycode.net',
    data: JSON.stringify(old),
    username: TMCWebClient.session.getUsername(),
    password: TMCWebClient.session.getPassword(),
  });
};

TMCWebClient.spyware.prototype.timedSubmit = function(interval) {
  setInterval(this.submit.bind(this), interval);
};
