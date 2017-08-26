import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Login from '../views/Login'

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, password) => {
      dispatch(TrackActions.attemptLogin(username, password))
    }
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainer