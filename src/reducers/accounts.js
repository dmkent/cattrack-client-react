import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';


function getInitialState() {
  return {
    accounts: Immutable.OrderedMap(),
    upload_in_progress: false,
    upload_progress: 0,
    upload_result: null,
  }
}


const accounts = (state = null, action) => {
  if (state === null) {
    state = getInitialState();
  }

  switch (action.type) {
    case TrackActionTypes.ACCOUNTS_LOADED:
      return Object.assign({}, state, {
        accounts: Immutable.OrderedMap(action.accounts.map(account => [
          account.id,
          account,
        ])),
      });
    case TrackActionTypes.ACCOUNT_UPLOAD_STARTED:
      return Object.assign({}, state, {
        upload_in_progress: true,
        upload_progress: 0,
        upload_result: null,
      });
    case TrackActionTypes.ACCOUNT_UPLOAD_PROGRESS_UPDATE:
      return Object.assign({}, state, {
        upload_progress: action.progress,
      })
    case TrackActionTypes.ACCOUNT_UPLOAD_SUCESS:
      return Object.assign({}, state, {
        upload_in_progress: false,
        upload_progress: 100,
        upload_result:'Success',
      });
    case TrackActionTypes.ACCOUNT_UPLOAD_ERROR:
      return Object.assign({}, state, {
        upload_in_progress: false,
        upload_progress: 0,
        upload_result: action.error.message,
      });
    default:
      return state;
  }
}

export default accounts;