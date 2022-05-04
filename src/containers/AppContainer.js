import {connect} from 'react-redux';
import TrackActions from '../actions/TrackActions'
import AppView from '../views/AppView'

export function mapStateToProps(state) {
  return {
    ...state.app
  }
}

export function mapDispatchToProps(dispatch) {
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