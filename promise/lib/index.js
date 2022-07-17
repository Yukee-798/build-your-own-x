class _Promise {
  static PROMISE_STATUS_PENDING = 0;
  static PROMISE_STATUS_FULFILLED = 1;
  static PROMISE_STATUS_REJECTED = 2;

  status = _Promise.PROMISE_STATUS_PENDING;
  value;
  reason;

  // 通过 then、catch 绑定的多个微任务会放在下面的队列中
  onFulfilledTasks = [];
  onRejectedTasks = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.status === _Promise.PROMISE_STATUS_PENDING) {
        this.status = _Promise.PROMISE_STATUS_FULFILLED;
        this.value = value;
        while (this.onFulfilledTasks.length) {
          this.onFulfilledTasks.shift()(value);
        }
      }
    };
    const reject = (reason) => {
      if (this.status === _Promise.PROMISE_STATUS_PENDING) {
        this.status = _Promise.PROMISE_STATUS_REJECTED;
        this.reason = reason;
        while (this.onRejectedTasks.length) {
          this.onRejectedTasks.shift()(reason);
        }
      }
    }

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}
