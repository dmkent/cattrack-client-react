import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Account from '../../data/Account'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Account actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
  })

  it('should create load accounts actions', () => {
    nock('http://localhost:8000')
      .get('/api/accounts/')
      .reply(200, [
        {id: 4, name: "Account1"},
        {id: 1, name: "Account2"},
      ])
        
    const expectedActions = [
      { 
        type: TrackActionTypes.ACCOUNTS_LOADED, 
        accounts: [
          new Account({id: 4, name: "Account1"}),
          new Account({id: 1, name: "Account2"}),
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadAccounts()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load accounts error action', () => {
    nock('http://localhost:8000')
      .get('/api/accounts/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.ACCOUNTS_LOAD_ERROR, 
        error: {
          code: 404,
          message: [
            [
              "Error", 
              "not found"
            ]
          ]
        }
      }
    ]

    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadAccounts()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create file upload actions', () => {
    nock('http://localhost:8000')
      .post('/api/accounts/1/load/')
      .reply(200, {success: "done"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_UPLOAD_SUCESS,
        account: 1
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.uploadToAccount(1, 'dummy file object')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should upload error actions', () => {
    nock('http://localhost:8000')
      .post('/api/accounts/1/load/')
      .reply(403, {error: "bad format"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_UPLOAD_ERROR,
        error: [
          [
            "Error", 
            "bad format"
          ]
        ],
        account: 1
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.uploadToAccount(1, 'dummy file object')).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create new account actions', () => {
    nock('http://localhost:8000')
      .post('/api/accounts/')
      .reply(200, {id: 4, name: "newacct"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_CREATE_SUCCESS,
        account: new Account({id: 4, name: "newacct"})
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.createAccount("newacct"))
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqualImmutable(expectedActions)
      })
  })

  it('should create account create error actions', () => {
    nock('http://localhost:8000')
      .post('/api/accounts/')
      .reply(404, {error: 'not found'})
        
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_CREATE_ERROR,
        name: "newacct",
        error: {
          code: 404,
          message: [[
            'Error',
            'not found'
          ]]
        }
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.createAccount("newacct"))
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqualImmutable(expectedActions)
      })
  })
})