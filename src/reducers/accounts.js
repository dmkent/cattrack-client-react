import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';


function getInitialState() {
  return {
    accounts: new Immutable.OrderedMap(),
    upload_in_progress: false,
    upload_progress: 0,
    upload_result: null,
  }
}


function accounts(state = null, action) {
  if (state === null) {
    state = getInitialState();
  }

  switch (action.type) {
    case TrackActionTypes.ACCOUNTS_LOADED:
      return Object.assign({}, state, {
        accounts: new Immutable.OrderedMap(action.accounts.map(account => [
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
        upload_result: 'Success',
      });
    case TrackActionTypes.ACCOUNT_UPLOAD_ERROR:
      return Object.assign({}, state, {
        upload_in_progress: false,
        upload_progress: 0,
        upload_result: action.error.message,
      });
    case TrackActionTypes.ACCOUNT_CREATE_SUCCESS:
      return Object.assign({}, state, {
        accounts: state.accounts.set(action.account.id, action.account)
      })
    default:
      return state;
  }
}

export default accounts;