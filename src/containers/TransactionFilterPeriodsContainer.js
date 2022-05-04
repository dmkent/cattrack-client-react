import { connect } from "react-redux";
import TransactionFilterPeriods from "../views/TransactionFilterPeriods";
import TrackActions from "../actions/TrackActions";

export function mapStateToProps(state) {
  return {
    categories: state.categories.categories,
    accounts: state.accounts.accounts,
    periods: state.periods,
    filters: state.transactions.filters,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadAccounts: () => {
      dispatch(TrackActions.loadAccounts());
    },
    loadPeriods: () => {
      dispatch(TrackActions.loadPeriods());
    },
    onFilter: (filters) => {
      dispatch(TrackActions.updateTransactionFilter(filters));
    },
  };
}

const TransactionFilterPeriodsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionFilterPeriods);

export default TransactionFilterPeriodsContainer;
