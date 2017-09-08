import reducer from '../auth'
import TrackActionTypes from '../../data/TrackActionTypes'

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
})