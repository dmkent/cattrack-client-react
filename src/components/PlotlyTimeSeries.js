import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import Plotly from "../client/PlotlyWrapper";

export function plotlyDataFromSeries(
  series,
  plot_invert = false,
  plot_type = "bar"
) {
  let values = [];
  let labels = [];

  // Get grand total
  if (series !== null) {
    series.map(function (element) {
      let value = parseFloat(element.get("value"));
      if (plot_invert) {
        value *= -1.0;
      }
      values.push(value);
      labels.push(element.get("label"));
    });
  }
  return {
    y: values,
    x: labels,
    type: plot_type,
  };
}

function PlotlyTimeSeries(props) {
  const plotContainer = useRef(null);
  const plotData = useRef([{}]);

  const updateDimensions = useCallback(() =>
    Plotly.Plots.resize(plotContainer.current)
  );
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
    props.plot_invert,
    props.plot_type
  );
  const plotLayout = {};

  useEffect(() => {
    if (hasRendered) {
      Plotly.redraw(plotContainer.current);
    } else {
      Plotly.plot(plotContainer.current, plotData.current, plotLayout);
      setHasRendered(true);
    }
  }, [plotContainer, props.series, props.plot_invert, props.plot_type]);

  return <div data-testid="plotly" ref={plotContainer}></div>;
}

PlotlyTimeSeries.propTypes = {
  series: PropTypes.instanceOf(Immutable.List),
  plot_type: PropTypes.string,
  plot_invert: PropTypes.bool,
};

PlotlyTimeSeries.defaultProps = {
  plot_type: "bar",
  plot_invert: false,
};

export default PlotlyTimeSeries;
