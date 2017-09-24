import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Plotly from '../client/PlotlyWrapper';

export function plotlyDataFromSeries(series) {
  let values = [];
  let labels = [];
  
  // Get grand total
  series.map(function(element) {
    values.push(-1 * parseFloat(element.get('value')));
    labels.push(element.get('label'));
  });
  return {
    y: values,
    x: labels,
    type: "bar",
  }
}

class PlotlyTimeSeries extends React.Component {
  constructor(props) {
    super(props)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    Plotly.Plots.resize(this.plotContainer)
  }

  componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
  }

  componentDidMount() {
    this.plot_data = [plotlyDataFromSeries(this.props.series)];

    this.plot_layout = {};

    Plotly.plot(this.plotContainer, this.plot_data, this.plot_layout);

    window.addEventListener("resize", this.updateDimensions);
  }

    componentWillReceiveProps(nextProps) {
      if (!Immutable.is(Immutable.fromJS(this.props.series), Immutable.fromJS(nextProps.series))) {
        this.plot_data[0] = plotlyDataFromSeries(nextProps.series);
        Plotly.redraw(this.plotContainer);
      }
    }

    render() {
        return <div ref={(plotDiv) => {
          this.plotContainer = plotDiv
        }}></div>;
    }
}

PlotlyTimeSeries.propTypes = {
  series: PropTypes.instanceOf(Immutable.List)
}

export default PlotlyTimeSeries;