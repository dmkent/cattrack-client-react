import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Accounts from '../views/Accounts'

const mapStateToProps = state => {
  return {
    auth: state.auth,
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAccounts: () => {
      dispatch(TrackActions.loadAccounts());
    }
  }
}

const AccountsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts)

export default AccountsContainer;