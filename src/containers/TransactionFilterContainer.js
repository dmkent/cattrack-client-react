import { connect } from 'react-redux';
import TransactionFilter from '../views/TransactionFilter'
import TrackActions from '../actions/TrackActions'

const mapStateToProps = state => {
  return {
      categories: state.categories.categories,
      accounts: state.accounts.accounts,
      periods: state.periods,
      filters: state.transactions.filters,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadAccounts: () => {
      dispatch(TrackActions.loadAccounts())
    },
    loadPeriods: () => {
      dispatch(TrackActions.loadPeriods())
    },
    onFilter: (filters) => {
      dispatch(TrackActions.updateTransactionFilter(filters));
    }
  }
}

const TransactionFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionFilter)

export default TransactionFilterContainer;