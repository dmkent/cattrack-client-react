import React, { useRef, useState, useEffect } from "react";
import Plotly from "../client/PlotlyWrapper";

interface SummaryItem {
  total: string;
  category_name: string;
}

interface PlotlyData {
  values: number[];
  labels: string[];
  type: string;
}

interface PlotlyPieProps {
  summary: SummaryItem[];
}

export function plotlyDataFromSummary(summary: SummaryItem[]): PlotlyData {
  let values: number[] = [];
  let labels: string[] = [];

  // Get grand total
  let total = 0.0;
  [...summary.values()].forEach(function (element) {
    let val = parseFloat(element.total);
    if (val > 0) {
      // skip income for now...
      return;
    }
    total += val * -1.0;
  });

  let thresh = total * 0.01;
  let other = 0.0;

  [...summary.values()].forEach(function (element) {
    let val = parseFloat(element.total);
    if (val > 0) {
      // skip income for now...
      return;
    }
    val = val * -1.0;
    if (val < thresh) {
      other += val;
    } else {
      values.push(val);
      labels.push(element.category_name);
    }
  }, this);

  if (other > 0) {
    values.push(other);
    labels.push("Other");
  }

  return {
    values: values,
    labels: labels,
    type: "pie",
  };
}

function PlotlyPie(props: PlotlyPieProps) {
  const plotContainer = useRef<HTMLDivElement>(null);
  const plotData = useRef<any[]>([{}]);
  const [hasRendered, setHasRendered] = useState(false);

  const plotLayout = {
    //height: 800,
    //width: 1000
  };
  plotData.current[0] = plotlyDataFromSummary(props.summary);

  useEffect(() => {
    if (hasRendered) {
      Plotly.redraw(plotContainer.current);
    } else {
      Plotly.newPlot(plotContainer.current, plotData.current, plotLayout);
      setHasRendered(true);
    }
  }, [plotContainer, props.summary]);

  return <div data-testid="plotly" ref={plotContainer}></div>;
}

export default PlotlyPie;