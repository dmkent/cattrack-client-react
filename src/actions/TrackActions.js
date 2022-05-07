import TrackActionTypes from "../data/TrackActionTypes";

import AccountActions from "./AccountActions";

const TrackActions = {
  ...AccountActions,

  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
  },
};

export default TrackActions;
