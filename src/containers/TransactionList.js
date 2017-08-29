import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Transactions from '../views/Transactions'

const mapStateToProps = state => {
  return {
    auth: state.auth,
    ...state.transactions
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelectTransactions: (page_num, page_size, filters) => {
      dispatch(TrackActions.selectTransactions(page_num, page_size, filters))
    },
    updateTransaction: (transaction) => {
      dispatch(TrackActions.updateTransaction(transaction));
    },
    setCategorisorTransaction: (transaction) => {
      dispatch(TrackActions.categorisorSetTransaction(transaction));
    },
    showCategorisor: () => {
      dispatch({
        type: 'categorisor/show',
      })
    },
  }
}

const TransactionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

export default TransactionList