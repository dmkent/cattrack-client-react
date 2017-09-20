import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Auth actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
  })

  it('should create a logout action', () => {
    let expectedAction = {
      type: TrackActionTypes.AUTH_LOGOUT,
    };
    expect(TrackActions.logout()).toEqual(expectedAction);
  });

  it('should create a login action', () => {
    nock('http://localhost:8000')
      .post('/api-token-auth/')
      .reply(200, {token: 'blahblahblah'})

    let expectedActions = [
      {
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: 'blahblahblah'
      }
    ];
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.attemptLogin('me', 'mysecret')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  it('should create a login failure action', () => {
    nock('http://localhost:8000')
      .post('/api-token-auth/')
      .reply(403, {error: 'naughty naughty'})

    let expectedActions = [
      {
        type: TrackActionTypes.AUTH_ERROR,
        error: {
          code: 403,
          message: [
            [
              "Error",
              "naughty naughty"
            ]
          ]
        },
        username: "me"
      }
    ];
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.attemptLogin('me', 'mysecret')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  it('should create a restore login action', () => {
    let expectedActions = [
      {
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: 'test'
      }
    ];
    localStorage.setItem('jwt', 'test')
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.restoreLogin()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  it('should not create a restore login action if not in localStore', () => {
    let expectedActions = [];
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.restoreLogin()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  });

  it('should create a login action with renewed token', () => {
    nock('http://localhost:8000')
      .post('/api-token-refresh/')
      .reply(200, {token: 'new token'})
      .get('/api/categories/')
      .reply(200, {})

    let expectedAction = {
      type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
      token: 'new token'
    };
    const auth_expires = new Date()
    auth_expires.setMinutes(auth_expires.getMinutes() + 1)
    const auth = {
      auth: {
        token: '', 
        is_logged_in: true, 
        expires: auth_expires
      }
    }
    const store = mockStore(auth)
    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()[0]).toEqualImmutable(expectedAction)
    })
  })

  it('should create a login auth error action with renewed token', () => {
    nock('http://localhost:8000')
      .post('/api-token-refresh/')
      .reply(403, {error: 'expired'})
      .get('/api/categories/')
      .reply(200, [])

    let expectedAction = {
      type: TrackActionTypes.AUTH_ERROR,
      error: {
        code: 403,
        message: [
          [
            "Error",
            "expired"
          ]
        ]
      }
    };
    const auth_expires = new Date()
    auth_expires.setMinutes(auth_expires.getMinutes() + 1)
    const auth = {
      auth: {
        token: '', 
        is_logged_in: true, 
        expires: auth_expires
      }
    }
    const store = mockStore(auth)
    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()[0]).toEqualImmutable(expectedAction)
    })
  })

  it('should create a login auth error action when renewing but not logged in', () => {
    nock('http://localhost:8000')
      .post('/api-token-refresh/')
      .reply(200, {token: 'token'})
      .get('/api/categories/')
      .reply(200, [])

    let expectedActions = [
      {
        type: TrackActionTypes.AUTH_ERROR,
        error: {
          message: "Not logged in."
        }
      },
      {
        type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR,
        error: new Error("No response received")
      }
    ];
    const auth_expires = new Date()
    auth_expires.setMinutes(auth_expires.getMinutes() + 1)
    const auth = {
      auth: {
        token: '', 
        is_logged_in: false, 
        expires: auth_expires
      }
    }
    const store = mockStore(auth)
    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create a login auth error action when renewing but log in expired', () => {
    nock('http://localhost:8000')
      .post('/api-token-refresh/')
      .reply(200, {token: 'token'})
      .get('/api/categories/')
      .reply(200, [])

    let expectedActions = [
      {
        type: TrackActionTypes.AUTH_LOGOUT
      },
      {
        type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR,
        error: new Error("No response received")
      }
    ];
    const auth_expires = new Date()
    auth_expires.setMinutes(auth_expires.getMinutes() - 10)
    const auth = {
      auth: {
        token: '', 
        is_logged_in: true, 
        expires: auth_expires
      }
    }
    const store = mockStore(auth)
    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})