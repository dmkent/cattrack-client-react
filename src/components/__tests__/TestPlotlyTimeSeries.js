import React from "react";
import Immutable from "immutable";
import { render, screen } from "@testing-library/react";

import PlotlyTimeSeries, { plotlyDataFromSeries } from "../PlotlyTimeSeries";

test("PlotlyTimeSeries should reshape series", () => {
  const raw = [
    Immutable.Map({ label: "2013-02-01", value: "-54" }),
    Immutable.Map({ label: "2013-03-01", value: "-3" }),
    Immutable.Map({ label: "2013-04-01", value: "-4" }),
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
    series: Immutable.List([]),
  };
  render(<PlotlyTimeSeries {...props} />);

  expect(screen.getByTestId("plotly")).toBeTruthy();
})

test("PlotlyTimeSeries should render content", () => {
  const props = {
    series: Immutable.List([
      Immutable.Map({ label: "2013-02-01", value: "-54" }),
      Immutable.Map({ label: "2013-03-01", value: "-3" }),
      Immutable.Map({ label: "2013-04-01", value: "-4" }),
    ]),
  };
  render(<PlotlyTimeSeries {...props} />);

  expect(screen.getByTestId("plotly")).toBeTruthy();
})