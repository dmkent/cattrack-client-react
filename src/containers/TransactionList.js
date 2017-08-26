import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Transactions from '../views/Transactions'

const mapStateToProps = state => {
  return {
    transactions: state.transactions,
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelectPage: id => {
      dispatch(TrackActions.selectTransactionPage(id))
    }
  }
}

const TransactionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)

export default TransactionList