import { connect } from "react-redux";
import TrackActions from "../actions/TrackActions";
import Accounts from "../views/Accounts";

export function mapStateToProps(state) {
  return {
    accounts: state.accounts,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadAccounts: () => {
      dispatch(TrackActions.loadAccounts());
    },
    createAccount: (name) => {
      dispatch(TrackActions.createAccount(name));
    },
    selectAccount: (account) => {
      dispatch(TrackActions.selectAccount(account));
      dispatch(TrackActions.loadAccountBalanceSeries(account));
    },
  };
}

const AccountsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts);

export default AccountsContainer;
