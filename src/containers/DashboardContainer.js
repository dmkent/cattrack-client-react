import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Dashboard from '../views/Dashboard'

const mapStateToProps = state => {
  return {
    auth: state.auth,
    summary: state.transactions.summary,
    filters: state.transactions.filters,
  }
}

const mapDispatchToProps = dispatch => {
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