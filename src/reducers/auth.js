import TrackActionTypes from '../data/TrackActionTypes';

function parseJwt (token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function getInitialState() {
  return {
    is_logged_in: false,
    username: null,
    user_id: null,
    email: null,
    expires: null,
    token: null,
  }
}

function auth(state = null, action) {
  if (state === null) {
    return getInitialState();
  }

  let payload = null
  let authExpires = null;

  switch (action.type) {
    case TrackActionTypes.AUTH_RESPONSE_RECEIVED:
      payload = parseJwt(action.token);
      authExpires = new Date(payload.exp * 1000);
      if (authExpires <= new Date()) {
        console.log("Auth expired. Expiry: " + authExpires);
        // Do more to ensure logout?;
        return getInitialState();
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
      return getInitialState();
    default:
      return state;
  }
}

export default auth;