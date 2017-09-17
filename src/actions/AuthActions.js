import TrackActionTypes from '../data/TrackActionTypes';

import {API_URI, checkStatus} from '../client/CatTrackAPI';

const AuthActions = {
  attemptLogin(username, password) {
    return (dispatch) => {
      return fetch(API_URI + '/api-token-auth/', {
          method: 'POST',
          body: JSON.stringify({username: username, password: password}),
          headers: {'Content-Type': 'application/json'}
        })
        .then(checkStatus)
        .then(resp => {
          localStorage.setItem('jwt', resp.token);
          dispatch({
            type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
            token: resp.token,
          })
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.AUTH_ERROR,
            error,
            username,
          });
        });
    };
  },
  restoreLogin() {
    const token = localStorage.getItem('jwt');
    return (dispatch) => {
      if (token !== undefined && token !== null) {
        dispatch({
          type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
          token: token,
        });
      }
      return Promise.resolve();
    }
  },
  logout() {
    localStorage.removeItem('jwt');
    return {
      type: TrackActionTypes.AUTH_LOGOUT,
    };
  },
};

export default AuthActions;