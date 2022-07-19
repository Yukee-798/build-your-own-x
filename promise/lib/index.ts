class __Promise {
  static PROMISE_STATUS_PENDING = 0;
  static PROMISE_STATUS_FULFILLED = 1;
  static PROMISE_STATUS_REJECTED = 2;

  status = __Promise.PROMISE_STATUS_PENDING;
  value: any;
  reason: any;

  // 通过 then、catch 绑定的多个微任务会放在下面的队列中
  onFulfilledTasks = [];
  onRejectedTasks = [];

  constructor(executor) {
    const resolve = (value) => {
      if (this.status === __Promise.PROMISE_STATUS_PENDING) {
        this.status = __Promise.PROMISE_STATUS_FULFILLED;
        this.value = value;
        while (this.onFulfilledTasks.length > 0) {
          const task = this.onFulfilledTasks.shift();
        }
      }
    };
    const reject = (reason) => {
      if (this.status === __Promise.PROMISE_STATUS_PENDING) {
        this.status = __Promise.PROMISE_STATUS_REJECTED;
        this.reason = reason;
        while (this.onRejectedTasks.length > 0) {
          // this.onRejectedTasks.shift()(reason);
        }
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}

module.exports = __Promise;
