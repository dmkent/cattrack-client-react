import Plotly from "plotly.js-basic-dist";
import React, { useRef, useState, useEffect } from "react";

import { CategorySummary } from "../data/Transaction";

interface PlotlyPieProps {
  summary: CategorySummary[];
}

export function plotlyDataFromSummary(summary: CategorySummary[]): Plotly.Data {
  const values: number[] = [];
  const labels: string[] = [];

  // Get grand total
  let total = 0.0;
  summary.forEach(function (element) {
    const val = element.total;
    if (val > 0) {
      // skip income for now...
      return;
    }
    total += val * -1.0;
  });

  const thresh = total * 0.01;
  let other = 0.0;

  summary.forEach(function (element) {
    let val = element.total;
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
  });

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
  const plotData = useRef<Plotly.Data>();
  const [hasRendered, setHasRendered] = useState(false);

  const plotLayout = {
    //height: 800,
    //width: 1000
  };
  plotData.current = plotlyDataFromSummary(props.summary);

  useEffect(() => {
    if (!plotContainer.current || !plotData.current) {
      return;
    }
    if (hasRendered) {
      Plotly.redraw(plotContainer.current);
    } else {
      Plotly.newPlot(plotContainer.current, [plotData.current], plotLayout);
      setHasRendered(true);
    }
  }, [plotContainer, props.summary]);

  return <div data-testid="plotly" ref={plotContainer}></div>;
}

export default PlotlyPie;
