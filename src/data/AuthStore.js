import {ReduceStore} from 'flux/utils';

import Dispatcher from './TrackDispatcher';
import TrackActionTypes from './TrackActionTypes';
import CatTrackDataManager from '../client/CatTrackDataManager';

function parseJwt (token: string) {
    let base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

class AuthStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      is_logged_in: false,
      username: null,
      user_id: null,
      email: null,
      expires: null,
      token: null,
    }
  }

  reduce(state, action) {
    switch (action.type) {
      case TrackActionTypes.AUTH_UPDATE:
        return state;
      case TrackActionTypes.AUTH_RESPONSE_RECEIVED:
        let payload = parseJwt(action.token);
        let authExpires = new Date(payload.exp * 1000);
        if (authExpires <= new Date()) {
            // do more to ensure logout?;
            return this.getInitialState();
        }
        return {
          is_logged_in: true,
          username: payload.username,
          user_id: payload.user_id,
          email: payload.email,
          expires: authExpires,
          token: action.token,
        };
      case TrackActionTypes.AUTH_LOGOUT:
        return this.getInitialState();
      default:
        return state;
    }
  }
}

export default new AuthStore();