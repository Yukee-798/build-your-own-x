const _Promise = require("../lib");

it("receives a executor function when constructed which is called immediately", () => {
  const executor = jest.fn();
  const promise = new _Promise(executor);

  expect(executor.mock.calls.length).toBe(1);

  // expect(typeof executor.mock.calls([0][0])).toBe("function");
  // expect(typeof executor.mock.calls([0][1])).toBe("function");
});
