import TrackActionTypes from '../data/TrackActionTypes';

function parseJwt (token: string) {
  let base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
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

const auth = (state = null, action) => {
  if (state === null) {
    return getInitialState();
  }
  switch (action.type) {
    case TrackActionTypes.AUTH_UPDATE:
      return state;
    case TrackActionTypes.AUTH_RESPONSE_RECEIVED:
      let payload = parseJwt(action.token);
      let authExpires = new Date(payload.exp * 1000);
      if (authExpires <= new Date()) {
        console.log("Auth expired. Expiry: " + authExpires);
        // do more to ensure logout?;
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