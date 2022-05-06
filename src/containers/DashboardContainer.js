import { connect } from "react-redux";
import TrackActions from "../actions/TrackActions";
import Dashboard from "../views/Dashboard";

export function mapStateToProps(state) {
  return {
    summary: state.transactions.summary,
    filters: state.transactions.filters,
    periods: state.periods,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadSummary: (filters) => {
      dispatch(TrackActions.loadTransactionSummary(filters));
    },
    onFilter: (filters) => {
      dispatch(TrackActions.updateTransactionFilter(filters));
    },
  };
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;
