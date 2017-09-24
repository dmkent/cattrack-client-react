import {connect} from 'react-redux';
import PlotlyTimeSeries from '../views/PlotlyTimeSeries'

export function mapStateToProps(state) {
  return {...state.category};
}

const PlotlyTimeSeriesContainer = connect(
  mapStateToProps,
  {}
)(PlotlyTimeSeries)

export default PlotlyTimeSeriesContainer;