import TrackActionTypes from "../data/TrackActionTypes";

import AccountActions from "./AccountActions";
import CategoryActions from "./CategoryActions";
import PaymentSeriesActions from "./PaymentSeriesActions";

const TrackActions = {
  ...AccountActions,
  ...CategoryActions,
  ...PaymentSeriesActions,

  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
  },
};

export default TrackActions;
