import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Immutable from "immutable";
import TransactionFilterPeriods from "../TransactionFilterPeriods";

function setup(periods, filters) {
  const props = {
    updateFilters: jest.fn(),
    filters: filters,
    periods: Immutable.List(periods),
  };

  render(<TransactionFilterPeriods {...props} />);

  return {
    props,
  };
}

test("TransactionFilterPeriods should render self and subcomponents", () => {
  setup([], {});
  expect(screen.getByTestId("dateRangePicker")).toBeTruthy();
});

test("TransactionFilterPeriods changing dates should change filter", () => {
  const { props } = setup([], {});

  fireEvent.change(screen.getByRole("textbox", {name: "Start Date"}), {
    target: {value: "01/01/2017"}
  })
  expect(props.updateFilters.mock.calls[0][0]).toEqual({
    from_date: "2017-01-01",
    to_date: null,
  });
  fireEvent.change(screen.getByRole("textbox", {name: "End Date"}), {
    target: {value: "02/01/2017"}
  })
  expect(props.updateFilters.mock.calls[1][0]).toEqual({
    from_date: null,
    to_date: "2017-02-01",
  });
  expect(props.updateFilters.mock.calls.length).toBe(2);
});

test("TransactionFilterPeriods should display some periods", () => {
  const { props } = setup(
    [
      {
        id: 0,
        offset: 0,
        from_date: "2017-01-01",
        to_date: "2017-02-01",
        label: "Month",
      },
    ],
    { to_date: null, from_date: null }
  );
  expect(screen.getByRole("button", {name: "Month"})).not.toBeDisabled();
  fireEvent.click(screen.getByRole("button", {name: "Month"}));
  expect(props.updateFilters.mock.calls.length).toBe(1);
});

test("TransactionFilterPeriods should detect null current filter", () => {
  const { props } = setup(
    [
      {
        id: 0,
        offset: 0,
        from_date: "2017-01-01",
        to_date: "2017-02-01",
        label: "Month",
      },
    ],
    { from_date: null, to_date: null }
  );
  expect(screen.getByRole("button", {name: "Month"})).not.toBeDisabled();
  fireEvent.click(screen.getByRole("button", {name: "Month"}));
  expect(props.updateFilters.mock.calls.length).toBe(1);

  // reset to "All"
  fireEvent.click(screen.getByRole("button", {name: "All"}));
  expect(props.updateFilters.mock.calls.length).toBe(2);
  expect(props.updateFilters.mock.calls[1][0]).toEqual({
    from_date: null,
    to_date: null,
  });
});
