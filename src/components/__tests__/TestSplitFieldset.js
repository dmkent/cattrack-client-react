import React from "react";
import { render, screen } from "@testing-library/react";
import Immutable from "immutable";
import SplitFieldset from "../SplitFieldset";

function setup(valid, message) {
  const props = {
    is_valid: {
      valid: valid,
      message: message,
    },
    index: 1,
    multiple_splits_exist: true,
    removeSplitCat: jest.fn(),
    setSplitCategory: jest.fn(),
    setSplitAmount: jest.fn(),
    split: {
      category: "1",
      amount: "-23",
    },
    categories: [
      { id: 0, name: "cat1" },
      { id: 1, name: "cat2" },
    ],
  };

  render(<SplitFieldset {...props} />);

  return props;
}

test("should render self and subcomponents", () => {
  setup(null, "");
  expect(screen.getByLabelText("Category")).toHaveValue("1");
  expect(screen.getByLabelText("Amount")).toHaveValue(-23);
});
test("should render self and subcomponents if valid state", () => {
  setup(true, "");
  expect(screen.getByLabelText("Category")).toHaveValue("1");
  expect(screen.getByLabelText("Amount")).toHaveValue(-23);
});
test("should render self and subcomponents if invalid state", () => {
  setup(false, "error");
  expect(screen.getByLabelText("Category")).toHaveValue("1");
  expect(screen.getByLabelText("Amount")).toHaveValue(-23);
});
