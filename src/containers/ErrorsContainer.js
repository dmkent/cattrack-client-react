import { connect } from 'react-redux';
import TrackActions from '../actions/TrackActions'
import Errors from '../views/Errors'

const mapStateToProps = state => {
  return {
    errors: state.errors,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleAlertDismiss: (idx) => {
        dispatch(TrackActions.clearError(idx));
    }
  }
}

const ErrorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Errors)

export default ErrorsContainer