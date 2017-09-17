import TrackActionTypes from '../data/TrackActionTypes';

import {fetch_from_api, checkStatus} from '../client/CatTrackAPI';

import Period from '../data/Period';

const PeriodActions = {
  loadPeriods() {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/periods/')
        .then(checkStatus)
        .then(rawPeriods => {
          dispatch({
            type: TrackActionTypes.PERIODS_LOADED,
            periods: rawPeriods.map(rawPeriod => {
                return new Period(rawPeriod);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.PERIODS_LOAD_ERROR,
            error,
          });
        });
    };
  },
};

export default PeriodActions;