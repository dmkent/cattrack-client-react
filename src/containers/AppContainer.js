import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import AppView from '../views/AppView'

const mapStateToProps = state => {
  return {
    transactions: state.transactions,
    auth: state.auth,
    accounts: state.accounts,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, password) => {
      dispatch(TrackActions.attemptLogin(username, password))
    },
    restoreLogin: () => {
      dispatch(TrackActions.restoreLogin())
    },
    loadAccounts: () => {
      dispatch(TrackActions.loadAccounts());
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppView)

export default AppContainer