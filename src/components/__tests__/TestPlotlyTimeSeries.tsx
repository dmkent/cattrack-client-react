import { render, screen } from "@testing-library/react";
import { PlotData } from "plotly.js-basic-dist";
import { expect, test } from "vitest";

import { SeriesPoint } from "../../data/Account";
import { PlotlyTimeSeries, plotlyDataFromSeries } from "../PlotlyTimeSeries";

test("PlotlyTimeSeries should reshape series", () => {
  const raw: SeriesPoint[] = [
    { label: "2013-02-01", value: -54 },
    { label: "2013-03-01", value: -3 },
    { label: "2013-04-01", value: -4 },
  ];
  const res = plotlyDataFromSeries(raw, true) as PlotData;
  expect(res.y).toEqual([54, 3, 4]);
  expect(res.x).toEqual(["2013-02-01", "2013-03-01", "2013-04-01"]);
});

test("should handle null series", () => {
  const res = plotlyDataFromSeries(null) as PlotData;
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
  const series: SeriesPoint[] = [
    { label: "2013-02-01", value: -54 },
    { label: "2013-03-01", value: -3 },
    { label: "2013-04-01", value: -4 },
  ];
  render(<PlotlyTimeSeries series={series} />);

  expect(screen.getByTestId("plotly")).toBeTruthy();
});
