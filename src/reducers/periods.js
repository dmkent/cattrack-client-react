import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';


const periods = (state = null, action) => {
  if (state === null) {
    state = Immutable.List();
  }

  switch (action.type) {
    case 'periods/loaded':
      return Immutable.List(action.periods);
    default:
      return state;
  }
}

export default periods;