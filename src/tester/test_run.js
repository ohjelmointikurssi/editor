import testWorkerTemplate from './test_runner_worker.template';

export default class TestRun {
  constructor(files) {
    const fileArray = Object.getOwnPropertyNames(files)
      .filter(o => o.endsWith('.js') && !o.endsWith('test.js'))
      .map(o => files[o])
      .map((o) => {
        let nameSplit = o.name.split('/');
        return {
          name: nameSplit[nameSplit.length - 1],
          content: o.asText(),
        };
      });
    this.files = {};
    fileArray.forEach((file) => {
      this.files[file.name] = file.content;
    });

    this.testSource = Object.getOwnPropertyNames(files)
      .filter(o => o.endsWith('.js') && o.endsWith('test.js'))
      .sort()
      .map(o => files[o].asText())
      .join('\n');
  }

  start() {
    const workerString = testWorkerTemplate();
    const workerBlob = new Blob([workerString], {type: 'text/javascript'})
    this.worker = new Worker(URL.createObjectURL(workerBlob));
    this.worker.onmessage = this._handleResponse.bind(this);
  }

  _handleResponse(event) {
    var response = event.data;
    if (response.status === 'ready') {
      this._postData();
    } else if (response.status === 'complete') {
      this._onComplete(response);
    } else {
      throw new Error('Worker sent an illegal message.');
    }
  }

  _postData() {
    var msg = {
      files: this.files,
      testSource: this.testSource,
      // We need this for importing dependencies inside the worker
      url: location.protocol + '//' + location.host,
    }
    this.worker.postMessage(msg);
  }

  _onComplete(testResults) {
    this.passed = testResults.passed;
    this.failed = testResults.failed;
    this.complete = true;
    this.worker.terminate();
    console.info(`Running tests complete! ${this.passed.length} tests passed and ${this.failed.length} failed.`);
    if (this.failed.length !== 0) {
      console.info('Failed tests: ');
    }
    this.failed.forEach((failure) => {
      console.info(`>> Title: %c${failure.title}%c, error: %c${failure.error}%c`, 'color: blue', 'color: black', 'color: red', 'color: black');
    });
  }
}
