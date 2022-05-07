import reducer from "../index";

describe("combined reducer", () => {
  it("should return the initial state", () => {
    expect(Object.keys(reducer(undefined, {}))).toEqual([
      "accounts",
      "errors",
      "budget",
    ]);
  });
});
