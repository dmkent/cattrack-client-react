import Plotly from "plotly.js-basic-dist";
import { useCallback, useEffect, useRef } from "react";

import { SeriesPoint } from "../data/Account";

interface PlotlyTimeSeriesProps {
  series: SeriesPoint[];
  plot_invert?: boolean;
  plot_type?: Plotly.PlotType;
}

export function plotlyDataFromSeries(
  series: SeriesPoint[] | null,
  plot_invert: boolean = false,
  plot_type: Plotly.PlotType = "bar",
): Plotly.Data {
  const values: number[] = [];
  const labels: string[] = [];

  // Get grand total
  if (series !== null) {
    series.map(function (element) {
      let value = element.value;
      if (plot_invert) {
        value *= -1.0;
      }
      values.push(value);
      labels.push(element.label);
    });
  }
  return {
    y: values,
    x: labels,
    type: plot_type,
  };
}

export function PlotlyTimeSeries(props: PlotlyTimeSeriesProps) {
  const plotContainer = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    if (plotContainer.current) {
      Plotly.Plots.resize(plotContainer.current);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => {
      // Clean up the listener
      window.removeEventListener("resize", updateDimensions);
    };
  });

  const plotData = plotlyDataFromSeries(
    props.series,
    props.plot_invert || false,
    props.plot_type || "bar",
  );
  const plotLayout = {};

  useEffect(() => {
    if (plotContainer.current === null || plotData === undefined) {
      return;
    }

    Plotly.react(plotContainer.current, [plotData], plotLayout);
  }, [plotContainer, props.series, props.plot_invert, props.plot_type]);

  return <div data-testid="plotly" ref={plotContainer}></div>;
}
