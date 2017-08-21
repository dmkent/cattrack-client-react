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
      case TrackActionTypes.AUTH_REQUEST:
        CatTrackDataManager.performLogin(action.username, action.password);
        return state;
      case TrackActionTypes.AUTH_RESPONSE_RECEIVED:
        let payload = parseJwt(action.token);
        let authExpires = new Date(payload.exp * 1000);
        if (authExpires <= new Date()) {
            // do more to ensure logout?;
            return this.getInitialState();
        }
        localStorage.setItem('jwt', action.token);
        return {
          is_logged_in: true,
          username: payload.username,
          user_id: payload.user_id,
          email: payload.email,
          expires: authExpires,
          token: action.token,
        };
      case TrackActionTypes.AUTH_LOGOUT:
        localStorage.removeItem('jwt');
        return this.getInitialState();
      default:
        return state;
    }
  }

  _updateAuth(token?: string) {
    if (token === undefined) {
        token = localStorage.getItem('auth_token');
    }

    if (token) {
        let payload = parseJwt(token);
        this.authExpires = new Date(payload.exp * 1000);
        if (this.authExpires <= new Date()) {
            this._clearAuth();
            return false;
        }
        this.authToken = token;
        this.headers.set('Authorization', 'JWT ' + this.authToken);
        return true;
    }
    return false;
  }

  refreshLogin(): Promise<any> {
      let now = new Date();
      // 1. check if we are expired - clear auth
      if (now > this.authExpires) {
          this._clearAuth();
          return new Promise((resolve, reject) => reject('Expired'));
      }

      // 2. check if more than 5 mins until expire - don't refresh
      if ((this.authExpires.getTime() - now.getTime()) > 300000 ) {
          return new Promise((resolve, reject) => resolve('Already valid'));
      }

      // 3. not expired, but near expiry - refresh
      let headers = new Headers({
          'Content-Type': 'application/json',
      });
      let args = new URLSearchParams();
      args.set('format', 'json');
      return this.http.post(this.refreshLoginUrl,
                            JSON.stringify({token: this.authToken}),
                            {headers: headers, search: args})
                  .toPromise()
                  .then(res => {
                      let token = res.json().token;
                      this._updateAuth(token);
                  })
                  .catch(error => this.handleLoginError(error));
  }
}

export default new AuthStore();