import TrackActionTypes from "../data/TrackActionTypes";

import AccountActions from "./AccountActions";
import PaymentSeriesActions from "./PaymentSeriesActions";

const TrackActions = {
  ...AccountActions,
  ...PaymentSeriesActions,

  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
  },
};

export default TrackActions;
