import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import Plotly from "../client/PlotlyWrapper";

export function plotlyDataFromSeries(series, plot_invert = false) {
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
  };
}

class PlotlyTimeSeries extends React.Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    Plotly.Plots.resize(this.plotContainer);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentDidMount() {
    this.plot_data = [
      plotlyDataFromSeries(this.props.series, this.props.plot_invert),
    ];
    this.plot_data[0].type = this.props.plot_type;

    this.plot_layout = {};

    Plotly.plot(this.plotContainer, this.plot_data, this.plot_layout);

    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !Immutable.is(
        Immutable.fromJS(this.props.series),
        Immutable.fromJS(nextProps.series)
      )
    ) {
      this.plot_data[0] = Object.assign(
        {},
        this.plot_data[0],
        plotlyDataFromSeries(nextProps.series, nextProps.plot_invert)
      );
      Plotly.redraw(this.plotContainer);
    }
  }

  render() {
    return (
      <div
        ref={(plotDiv) => {
          this.plotContainer = plotDiv;
        }}
      ></div>
    );
  }
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
