import reducer from '../auth'
import TrackActionTypes from '../../data/TrackActionTypes'

/** 
 * Creates something that looks like a JWT token an contains encoded payload.
 * 
 * @param {Object} payload : Encodes this object as the payload.
 * @returns {string} that looks like a JWT token.
 */
function createJWT (payload) {
  const base64Url = window.btoa(JSON.stringify(payload))
    .replace('+', '-')
    .replace('/', '_');
  return "aaaaa." + base64Url + ".bbbbb";
}

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        is_logged_in: false,
        username: null,
        user_id: null,
        email: null,
        expires: null,
        token: null,
      }
    )
  })

  it('should ignore some actions', () => {
    const state = {
        is_logged_in: false,
        username: null,
        user_id: null,
        email: null,
        expires: null,
        token: null,
    }
    expect(reducer(state, {
      type: TrackActionTypes.PERIODS_LOAD_ERROR
    })).toEqual(state);
  })

  it('should handle AUTH_RESPONSE_RECEIVED', () => {
    const initState = {
      is_logged_in: false,
      username: null,
      user_id: null,
      email: null,
      expires: null,
      token: null,
    }

    const exp_date = new Date()
    exp_date.setMinutes(exp_date.getMinutes() + 10)
    const token = createJWT({
      exp: exp_date.getTime() / 1000.0,
      username: "test",
      user_id: "test",
      email: "me@somewhere.com"
    })
    const expectedState = {
      is_logged_in: true,
      username: "test",
      user_id: "test",
      email: "me@somewhere.com",
      expires: exp_date,
      token: token,
    }

    expect(
      reducer(initState, {
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: token
      })
    ).toEqual(expectedState)
  })

  it('should handle AUTH_RESPONSE_RECEIVED but with expired token', () => {
    const initState = {
      is_logged_in: false,
      username: null,
      user_id: null,
      email: null,
      expires: null,
      token: null,
    }

    const exp_date = new Date()
    exp_date.setMinutes(exp_date.getMinutes() - 10)
    const token = createJWT({
      exp: exp_date.getTime() / 1000.0,
      username: "test",
      user_id: "test",
      email: "me@somewhere.com"
    })

    expect(
      reducer(initState, {
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: token
      })
    ).toEqual(initState)
  })

  it('should handle AUTH_LOGOUT', () => {
    const exp_date = new Date()
    exp_date.setMinutes(exp_date.getMinutes() + 10)
    const token = createJWT({
      exp: exp_date.getTime() / 1000.0,
      username: "test",
      user_id: "test",
      email: "me@somewhere.com"
    })
    const initState = {
      is_logged_in: true,
      username: "test",
      user_id: "test",
      email: "me@somewhere.com",
      expires: exp_date,
      token: token,
    }

    const expectedState = {
      is_logged_in: false,
      username: null,
      user_id: null,
      email: null,
      expires: null,
      token: null,
    }

    expect(
      reducer(initState, {
        type: TrackActionTypes.AUTH_LOGOUT,
        token: token
      })
    ).toEqual(expectedState)
  })
})