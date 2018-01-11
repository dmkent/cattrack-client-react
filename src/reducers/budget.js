import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';

function getInitialState() {
  return {
    summaries: [],
  }
}

function budget(state = null, action) {
  if (state === null) {
    state = getInitialState();
  }
  switch (action.type) {
    case "BUDGET_SUMMARY_SUCCESS":
      return Object.assign({}, state, {
        summaries: action.summary,
      });
    default:
      return state;
  }
}
export default budget;