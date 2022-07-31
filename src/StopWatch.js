export class StopWatch {
  constructor(stopTime) {
    this.stopTime = stopTime ?? -1;
    this._elapsedTime = 0;
    this.interval = undefined;
    this.timeEventListeners = {};
    this.tickEventListeners = [];
    this.intervals = [];
  }

  isPaused() {
    return this.interval == undefined;
  }

  start() {
    if (this.isPaused()) {
      this.interval = setInterval(() => {
        ++this._elapsedTime;

        const listener = this.timeEventListeners[this._elapsedTime];

        if (listener) {
          listener(this);
        }
        this.tickEventListeners.forEach((callback) => callback(this));
      }, 1000);
    }

    this.intervals.forEach((intervalInfo) => {
      console.log("aqui");
      intervalInfo.intervalHandler = setInterval(
        intervalInfo.callback,
        intervalInfo.timeout
      );
    });
  }

  pause() {
    if (!this.isPaused()) {
      clearInterval(this.interval);
      this.interval = undefined;

      this.intervals.forEach((intervalInfo) => {
        clearInterval(intervalInfo.intervalHandler);
        intervalInfo.intervalHandler = undefined;
      });
    }
  }

  reset() {
    this.pause();
    this._elapsedTime = 0;
  }

  elapsedTime() {
    return this._elapsedTime;
  }

  addTimeEventListerner(elapsedTime, callback) {
    this.timeEventListeners[elapsedTime] = callback;
  }

  addTimeEventListerners(timeLisetersList) {
    timeLisetersList.forEach(({ elapsedTime, callback }) =>
      this.addTimeEventListerner(elapsedTime, callback)
    );
  }

  executeOnInterval(callback, timeout) {
    let intervalHandler;

    if (this.isPaused()) {
      intervalHandler = undefined;
    } else {
      intervalHandler = setInterval(callback, timeout);
    }

    this.intervals.push({
      intervalHandler,
      timeout,
      callback,
    });
  }
}
