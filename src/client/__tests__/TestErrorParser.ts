import { describe, expect, it } from "vitest";

import {
  isString,
  capitalise,
  camelCaseToVerbose,
  underscoredToVerbose,
  parseErrors,
} from "../ErrorParser";

describe("API and helpers", () => {
  it("can test is something is a string", () => {
    expect(isString("a string")).toBeTruthy();
    expect(isString({})).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString("")).toBeTruthy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(null)).toBeFalsy();
    expect(isString(32)).toBeFalsy();
  });

  it("can capitalise stuff", () => {
    expect(capitalise("this")).toEqual("This");
    expect(capitalise("")).toEqual("");
    expect(capitalise("this and this")).toEqual("This and this");
  });

  it("can convert camel case", () => {
    expect(camelCaseToVerbose("ThisIsInCamelCase")).toEqual(
      "This Is In Camel Case",
    );
    expect(camelCaseToVerbose("This_is_not")).toEqual("This_is_not");
    expect(camelCaseToVerbose("")).toEqual("");
  });

  it("can convert snake case", () => {
    expect(underscoredToVerbose("this_is_in_snake_case")).toEqual(
      "this is in snake case",
    );
    expect(underscoredToVerbose("ThisIsNot")).toEqual("ThisIsNot");
    expect(underscoredToVerbose("")).toEqual("");
  });

  it("can parse Django REST errors", () => {
    expect(parseErrors({ detail: "This is an error" })).toEqual([
      "Detail: This is an error",
    ]);
    expect(
      parseErrors({
        AmountKey: ["Amount is required"],
        name: ["Name must be longer than zero"],
      }),
    ).toEqual([
      "Amount key: Amount is required",
      "Name: Name must be longer than zero",
    ]);
    expect(
      parseErrors({
        amount_key: [
          {
            something: "nested",
          },
        ],
      }),
    ).toEqual(['Amount key: [\n  {\n    "something": "nested"\n  }\n]']);
    expect(parseErrors({ detail: null })).toEqual(["detail"]);
  });
});
