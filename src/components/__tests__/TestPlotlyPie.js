import React from "react";
import { render, screen } from "@testing-library/react";
import PlotlyPie, { plotlyDataFromSummary } from "../PlotlyPie";

function setup(summary) {
  const props = {
    summary: summary,
  };

  render(<PlotlyPie {...props} />);

  return {
    props,
  };
}

test("plotyDataForSummary should determine totals, values", () => {
  const summary = [
    { category_name: "A", total: "-3.5" },
    { category_name: "B", total: "-2.1" },
    { category_name: "C", total: "-0.4" },
    { category_name: "D", total: "0.4" },
    { category_name: "E", total: "-0.001" },
    { category_name: "F", total: "-0.001" },
  ];
  const res = plotlyDataFromSummary(summary);
  expect(res.values).toEqual([3.5, 2.1, 0.4, 0.002]);
  expect(res.labels).toEqual(["A", "B", "C", "Other"]);
});

test("PlotlyPie should render self and subcomponents", () => {
  setup([]);

  expect(screen.getByTestId("plotly")).toBeTruthy();
});
