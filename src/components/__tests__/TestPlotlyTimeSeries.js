import React from "react";
import { render, screen } from "@testing-library/react";

import PlotlyTimeSeries, { plotlyDataFromSeries } from "../PlotlyTimeSeries";

test("PlotlyTimeSeries should reshape series", () => {
  const raw = [
    ({ label: "2013-02-01", value: "-54" }),
    ({ label: "2013-03-01", value: "-3" }),
    ({ label: "2013-04-01", value: "-4" }),
  ];
  const res = plotlyDataFromSeries(raw, true);
  expect(res.y).toEqual([54, 3, 4]);
  expect(res.x).toEqual(["2013-02-01", "2013-03-01", "2013-04-01"]);
});

test("should handle null series", () => {
  const res = plotlyDataFromSeries(null);
  expect(res.y).toEqual([]);
  expect(res.x).toEqual([]);
});

test("PlotlyTimeSeries should render empty", () => {
  const props = {
    series: [],
  };
  render(<PlotlyTimeSeries {...props} />);

  expect(screen.getByTestId("plotly")).toBeTruthy();
});

test("PlotlyTimeSeries should render content", () => {
  const props = {
    series: [
      { label: "2013-02-01", value: "-54" },
      { label: "2013-03-01", value: "-3" },
      { label: "2013-04-01", value: "-4" },
    ],
  };
  render(<PlotlyTimeSeries {...props} />);

  expect(screen.getByTestId("plotly")).toBeTruthy();
});
