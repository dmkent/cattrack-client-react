import TrackActionTypes from "../data/TrackActionTypes";

const TrackActions = {
  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
  },
};

export default TrackActions;
