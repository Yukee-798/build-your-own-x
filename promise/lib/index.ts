export enum PromiseStatus {
  PENDING = 0,
  FULFILLED = 1,
  REJECTED = 2,
}

export type PromiseResolve<T> = (value?: T) => void;
export type PromiseReject = (reason?: Error) => void;

class __Promise<T> {
  status: PromiseStatus = PromiseStatus.PENDING;
  value: T | undefined;
  reason: Error | undefined;

  // 通过 then、catch 绑定的多个微任务会放在下面的队列中
  private onFulfilledTasks: Array<(value?: T) => void> = [];
  private onRejectedTasks: Array<(reason?: Error) => void> = [];

  constructor(
    executor: (resolve: PromiseResolve<T>, reject: PromiseReject) => any
  ) {
    const resolve: PromiseResolve<T> = (value) => {
      if (this.status === PromiseStatus.PENDING) {
        this.status = PromiseStatus.FULFILLED;
        this.value = value;
        while (this.onFulfilledTasks.length > 0) {
          const task = this.onFulfilledTasks.shift()!;
          task(value);
        }
      }
    };

    const reject: PromiseReject = (reason) => {
      if (this.status === PromiseStatus.PENDING) {
        this.status = PromiseStatus.REJECTED;
        this.reason = reason;
        while (this.onRejectedTasks.length > 0) {
          const task = this.onRejectedTasks.shift()!;
          task(reason);
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

const p = new __Promise<{
  code: number;
  data: {
    list: {
      id: number;
      name: string;
      age: number;
    }[];
  };
}>((resolve, reject) => {});

export default __Promise;
