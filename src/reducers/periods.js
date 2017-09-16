import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';


function periods(state = null, action) {
  if (state === null) {
    state = new Immutable.List();
  }

  switch (action.type) {
    case TrackActionTypes.PERIODS_LOADED:
      return new Immutable.List(action.periods);
    case TrackActionTypes.PERIODS_LOAD_ERROR:
      return state;
    default:
      return state;
  }
}

export default periods;