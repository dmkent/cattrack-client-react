import { connect } from "react-redux";
import TrackActions from "../actions/TrackActions";
import Transactions from "../views/Transactions";

export function mapStateToProps(state) {
  return {
    ...state.transactions,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    onSelectTransactions: (page_num, page_size, filters) => {
      dispatch(TrackActions.selectTransactions(page_num, page_size, filters));
    },
    updateTransaction: (transaction) => {
      dispatch(TrackActions.updateTransaction(transaction));
    },
    setCategorisorTransaction: (transaction) => {
      dispatch(TrackActions.categorisorSetTransaction(transaction));
    },
    showCategorisor: () => {
      dispatch(TrackActions.categorisorShow());
    },
  };
}

const TransactionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default TransactionList;
