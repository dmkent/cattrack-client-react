import React from 'react';
import Plotly from '../client/PlotlyWrapper';

export function plotlyDataFromSummary(summary) {
  let values = [];
  let labels = [];
  
  // Get grand total
  let total = 0.0;
  [...summary.values()].forEach(function(element) {
    let val = parseFloat(element.total);
    if (val > 0) {
      // skip income for now...
      return;
    }
    total += (val * -1.0);
  });

  let thresh = total * 0.01;
  let other = 0.0;
  
  [...summary.values()].forEach(function(element) {
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
  }
}

class PlotlyPie extends React.Component {
    componentDidMount() {
      this.plot_data = [plotlyDataFromSummary(this.props.summary)];

      this.plot_layout = {
        //height: 800,
        //width: 1000
      };

      Plotly.plot(this.refs.plotContainer, this.plot_data, this.plot_layout);
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.summary.equals(nextProps.summary)) {
        this.plot_data[0] = plotlyDataFromSummary(nextProps.summary);
        Plotly.redraw(this.refs.plotContainer);
      }
    }

    render() {
        return <div ref="plotContainer"></div>;
    }
}

export default PlotlyPie;