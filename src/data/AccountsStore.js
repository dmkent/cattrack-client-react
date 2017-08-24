import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Dispatcher from './TrackDispatcher';
import TrackActionTypes from './TrackActionTypes';
//import Account from './Account';
import CatTrackDataManager from '../client/CatTrackDataManager';

class AccountsStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      accounts: [{id:0,name:'test'},{id:1,name:'test2'}],//Immutable.Map(),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
  }

  reduce(state, action) {
    console.log(action);
    switch (action.type) {
      case 'accounts/upload-started':
        state.upload_in_progress = true;
        state.upload_progress = 0;
        state.upload_result = null;
        return state;
      case 'accounts/upload-progress-update':
        state.upload_progress = action.progress;
        return state;
      case 'accounts/upload-success':
        state.upload_in_progress = false;
        state.upload_progress = 100;
        state.upload_result = 'Success';
        return state;
      case 'accounts/upload-failed':
        state.upload_in_progress = false;
        state.upload_progress = 0;
        state.upload_result = action.error.message;
        return state;
      default:
        return state;
    }
  }
}

export default new AccountsStore();