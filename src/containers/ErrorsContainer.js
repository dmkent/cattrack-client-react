import { connect } from "react-redux";
import TrackActions from "../actions/TrackActions";
import Errors from "../views/Errors";

export function mapStateToProps(state) {
  return {
    errors: state.errors,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    handleAlertDismiss: (idx) => {
      dispatch(TrackActions.clearError(idx));
    },
  };
}

const ErrorsContainer = connect(mapStateToProps, mapDispatchToProps)(Errors);

export default ErrorsContainer;
