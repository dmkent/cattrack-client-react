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
        new Account({id: 4, name: "Account1"}),
        new Account({id: 1, name: "Account2"}),
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
        error: new Error(["Error: not found"])
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
        account: {id: 1}
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.uploadToAccount({id: 1}, 'dummy file object')).then(() => {
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
        error: new Error(["Error: bad format"]),
        account: {id: 1}
      },
    ]

    const store = mockStore({...dummyLoggedInState()})
    return store.dispatch(TrackActions.uploadToAccount({id: 1}, 'dummy file object')).then(() => {
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
        error: new Error(['Error: not found'])
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.createAccount("newacct"))
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should create account balance series load actions', () => {
    nock('http://localhost:8000')
    .get('/api/accounts/3/series/')
    .reply(200, [{label: '2013-02-01', value: -43}])
      
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_BALANCE_SERIES_LOADED,
        account: new Account({id: 3, name: "newacct"}),
        series: [{label: '2013-02-01', value: -43}]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadAccountBalanceSeries(new Account({id: 3, name: "newacct"})))
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqualImmutable(expectedActions)
      })
  })

  it('should create account balance series load error actions', () => {
    nock('http://localhost:8000')
    .get('/api/accounts/3/series/')
    .reply(404, {error: "not found"})
      
    const expectedActions = [
      {
        type: TrackActionTypes.ACCOUNT_BALANCE_SERIES_LOAD_ERROR,
        error: new Error(['Error: not found'])
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadAccountBalanceSeries({id: 3, name: "newacct"}))
      .then(() => {
        // Return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should create account select actions', () => {
    expect(TrackActions.selectAccount({id: 3, name: 'test'})).toEqualImmutable({
      type: TrackActionTypes.ACCOUNT_SELECTED,
      account: {id: 3, name: "test"}
    })
  })

})