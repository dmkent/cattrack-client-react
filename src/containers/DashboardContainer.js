import {connect} from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Dashboard from '../views/Dashboard'

export function mapStateToProps(state) {
  return {
    summary: state.transactions.summary,
    filters: state.transactions.filters,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadSummary: (filters) => {
        dispatch(TrackActions.loadTransactionSummary(filters));
    }
  }
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard)

export default DashboardContainer