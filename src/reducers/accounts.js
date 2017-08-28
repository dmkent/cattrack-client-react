import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';
//import Account from './Account';

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
    case 'accounts/loaded':
      return Object.assign({}, state, {
        accounts: Immutable.OrderedMap(action.accounts.map(account => [
          account.id,
          account,
        ])),
      });
    case 'accounts/upload-started':
      return Object.assign({}, state, {
        upload_in_progress: true,
        upload_progress: 0,
        upload_result: null,
      });
    case 'accounts/upload-progress-update':
      return Object.assign({}, state, {
        upload_progress: action.progress,
      })
    case 'accounts/upload-success':
      return Object.assign({}, state, {
        upload_in_progress: false,
        upload_progress: 100,
        upload_result:'Success',
      });
    case 'accounts/upload-failed':
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