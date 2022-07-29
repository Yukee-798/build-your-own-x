import _Promise, { PromiseStatus } from "../lib";

describe("1 Promise构造函数", () => {
  it("1.1 返回值是_Promise类型", () => {
    const p = new _Promise((resolve, reject) => {
      resolve();
    });
    expect(p).toBeInstanceOf(_Promise);
  });
  it("1.2 使用new实例化Promise后，传入的executor会被立即执行一次，并且接收两个函数类型参数resolve、reject", () => {
    // 创建一个模拟函数
    const mockExecutor = jest.fn(/* x => x * 2 */);

    // 使用 new 调用 _Promise
    new _Promise(mockExecutor);

    // mockExecutor 被立即调用一次
    expect(mockExecutor.mock.calls.length).toBe(1);

    // mockExecutor 的第一次调用时，传入的第一个参数和第二个参数是函数类型
    expect(mockExecutor.mock.calls[0][0]).toBeInstanceOf(Function);
    expect(mockExecutor.mock.calls[0][1]).toBeInstanceOf(Function);
  });
});

describe("2 同步调用resolve、reject以及throw异常，对promise对象状态的影响", () => {
  it("2.1 初始化的promise对象的状态是PENDING", () => {
    const p1 = new _Promise((resolve, reject) => {});
    expect(p1.status).toBe(PromiseStatus.PENDING);
  });

  it("2.2 executor中同步调用了resolve，promise对象的状态同步变为FULFILLED", () => {
    const p2 = new _Promise((resolve, reject) => resolve());
    expect(p2.status).toBe(PromiseStatus.FULFILLED);
  });

  it("2.3 executor中同步调用了reject，promise对象的状态同步变为REJECTED", () => {
    const p3 = new _Promise((resolve, reject) => reject());
    expect(p3.status).toBe(PromiseStatus.REJECTED);
  });

  it("2.4 executor中抛出异常，promise对象的状态同步变为REJECTED", () => {
    const mockExecutor = jest.fn((resolve, reject) => {
      throw new Error("error");
    });
    const p = new _Promise(mockExecutor);
    expect(p.status).toBe(PromiseStatus.REJECTED);
    expect(mockExecutor).toThrowError("error");
  });
});

describe("3 异步调用resolve、reject以及throw异常，对promise对象状态的影响", () => {
  it("3.1 executor中异步调用了resolve，promise对象的状态仍为PENDING", async () => {
    const p = new _Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(123);
      }, 0);
    });

    expect(p.status).toBe(PromiseStatus.PENDING);
    // expect(p).resolves.toBe(123); 这个只能用来测试原生的 Promise API，
    // expect(p).rejects.toMatch('error')
  });
});
