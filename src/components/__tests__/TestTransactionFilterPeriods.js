import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { format, sub } from "date-fns";
import TransactionFilterPeriods from "../TransactionFilterPeriods";

function setup(periods, filters) {
  const props = {
    updateFilters: jest.fn(),
    filters: filters,
    periods: periods,
  };

  const { container } = render(<TransactionFilterPeriods {...props} />);

  return {
    props,
    container,
  };
}

test("TransactionFilterPeriods should render self and subcomponents", () => {
  setup([], {});
  expect(screen.getByTestId("dateRangePicker")).toBeTruthy();
});

test("TransactionFilterPeriods changing dates should change filter", async () => {
  const testFromDate = sub(new Date(), { days: 10 });
  const testFromDateName = format(testFromDate, "MMMM d, yyyy", new Date());
  const testFromDateEvt = format(testFromDate, "yyyy-MM-dd", new Date());
  const testToDate = sub(new Date(), { days: 8 });
  const testToDateName = format(testToDate, "MMMM d, yyyy", new Date());
  const testToDateEvt = format(testToDate, "yyyy-MM-dd", new Date());

  const { props, container } = setup([], {});

  // Input from date
  var fromInput = screen.getByLabelText("Date from");
  fireEvent.change(fromInput, {target: {value: testFromDateEvt}});

  // Input to date
  var toInput = screen.getByLabelText("Date to");
  fireEvent.change(toInput, {target: {value: testToDateEvt}});

  expect(props.updateFilters.mock.calls[0][0]).toEqual({
    from_date: testFromDateEvt,
  });
  expect(props.updateFilters.mock.calls[1][0]).toEqual({
    to_date: testToDateEvt,
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
  expect(screen.getByRole("button", { name: "Month" })).not.toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Month" }));
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
  expect(screen.getByRole("button", { name: "Month" })).not.toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Month" }));
  expect(props.updateFilters.mock.calls.length).toBe(1);

  // reset to "All"
  fireEvent.click(screen.getByRole("button", { name: "All" }));
  expect(props.updateFilters.mock.calls.length).toBe(2);
  expect(props.updateFilters.mock.calls[1][0]).toEqual({
    from_date: null,
    to_date: null,
  });
});
