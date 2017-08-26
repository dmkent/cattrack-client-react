import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import AppView from '../views/AppView'

const mapStateToProps = state => {
  return {
    auth: state.auth,
    ...state.app
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
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppView)

export default AppContainer