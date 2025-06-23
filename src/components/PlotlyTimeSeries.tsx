import React, { useState, useCallback, useEffect, useRef } from "react";
import Plotly from "../client/PlotlyWrapper";
import { SeriesPoint } from "src/data/Account";

interface PlotlyData {
  y: number[];
  x: string[];
  type: string;
}

interface PlotlyTimeSeriesProps {
  series: SeriesPoint[];
  plot_invert?: boolean;
  plot_type?: string;
}

export function plotlyDataFromSeries(
  series: SeriesPoint[] | null,
  plot_invert: boolean = false,
  plot_type: string = "bar"
): PlotlyData {
  let values: number[] = [];
  let labels: string[] = [];

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

function PlotlyTimeSeries(props: PlotlyTimeSeriesProps) {
  const plotContainer = useRef<HTMLDivElement>(null);
  const plotData = useRef<any[]>([{}]);

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

  const [hasRendered, setHasRendered] = useState(false);
  plotData.current[0] = plotlyDataFromSeries(
    props.series,
    props.plot_invert || false,
    props.plot_type || "bar"
  );
  const plotLayout = {};

  useEffect(() => {
    if (plotContainer.current === null) {
      return;
    }
    
    if (hasRendered) {
      Plotly.redraw(plotContainer.current);
    } else {
      Plotly.newPlot(plotContainer.current, plotData.current, plotLayout);
      setHasRendered(true);
    }
  }, [plotContainer, props.series, props.plot_invert, props.plot_type]);

  return <div data-testid="plotly" ref={plotContainer}></div>;
}

export default PlotlyTimeSeries;