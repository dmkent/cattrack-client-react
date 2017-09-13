import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Account from '../../data/Account'
import Category from '../../data/Category'
import Period from '../../data/Period'
import Transaction from '../../data/Transaction'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

function dummyLoggedInState() {
    const auth_expires = new Date()
    auth_expires.setHours(auth_expires.getHours() + 1)
    return {
      auth: {
        token: '', 
        is_logged_in: true, 
        expires: auth_expires
      }
    }
}

describe('simple actions', () => {
  it('should create an action to clear error', () => {
    const idx = 2
    const expectedAction = {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx
    }
    expect(TrackActions.clearError(idx)).toEqual(expectedAction);
  });

  it('should create an add split action', () => {
    const expectedAction = {
      type: TrackActionTypes.CATEGORISOR_ADD_SPLIT,
    };
    expect(TrackActions.categorisorAddSplit()).toEqual(expectedAction);
  });

  it('should create a remove split action', () => {
    const expectedAction = {
      type: TrackActionTypes.CATEGORISOR_REMOVE_SPLIT,
      idx: 2
    };
    expect(TrackActions.categorisorRemoveSplit(2)).toEqual(expectedAction);
  });

  it('should create a set split action', () => {
    const expectedAction = {
      type: TrackActionTypes.CATEGORISOR_SET_SPLIT,
      idx: 2,
      name: 'a',
      value: 43.6
    };
    expect(TrackActions.categorisorSetSplit(2, 'a', 43.6)).toEqual(expectedAction);
  });

  it('should create a categorisor show/hide action', () => {
    let expectedAction = {
      type: TrackActionTypes.CATEGORISOR_SHOW,
    };
    expect(TrackActions.categorisorShow()).toEqual(expectedAction);

    expectedAction = {
      type: TrackActionTypes.CATEGORISOR_HIDE,
    };
    expect(TrackActions.categorisorHide()).toEqual(expectedAction);
  });
})

describe('api actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should create load category actions', () => {
    nock('http://localhost:8000')
      .get('/api/categories/')
      .reply(200, [
        {"url": "http://localhost:8000/api/categories/48/", "id": 48, "name": "Bank - Fees"},
        {"url": "http://localhost:8000/api/categories/15/", "id": 15, "name": "Bank - Interest"},
        {"url": "http://localhost:8000/api/categories/3/", "id": 3, "name": "Caffeine"},
      ])
        
    const expectedActions = [
      {
        type: TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED, 
        categories: [
          new Category({id: 48, name: "Bank - Fees"}),
          new Category({id: 15, name: "Bank - Interest"}),
          new Category({id: 3, name: "Caffeine"})
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load category error action', () => {
    nock('http://localhost:8000')
      .get('/api/categories/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR, 
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
    const store = mockStore({auth: {token: ''}})

    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create load period actions', () => {
    nock('http://localhost:8000')
      .get('/api/periods/')
      .reply(200, [
        {id: 4, label: "Last month", from_date: "2011-01-02", to_date: "2011-02-02", offset: "1"},
        {id: 1, label: "Last week", from_date: "2011-01-24", to_date: "2011-02-02", offset: "1"},
      ])
        
    const expectedActions = [
      { 
        type: TrackActionTypes.PERIODS_LOADED, 
        periods: [
          new Period({id: 4, label: "Last month", offset: "1", from_date: "2011-01-02", to_date: "2011-02-02"}),
          new Period({id: 1, label: "Last week", from_date: "2011-01-24", to_date: "2011-02-02", offset: "1"}),
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadPeriods()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load period error action', () => {
    nock('http://localhost:8000')
      .get('/api/periods/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.PERIODS_LOAD_ERROR, 
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

    return store.dispatch(TrackActions.loadPeriods()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
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

  it('should create select transactions actions', () => {
    nock('http://localhost:8000')
      .get(/\/api\/transactions\/\?page=.&page_size=../)
      .reply(200, {
        results: [
          {id: 4, when: "2011-01-01", amount: -34.2, description: "money"},
          {id: 4, when: "2011-01-04", amount: 34.2, description: "money money"},
        ],
        count: 2032
      }
    )
        
    const expectedActions = [
      { 
        type: TrackActionTypes.TRANSACTION_PAGE_LOADED, 
        page_num: 1,
        page_size: 20,
        transactions: [
          new Transaction({id: 4, when: "2011-01-01", amount: -34.2, description: "money"}),
          new Transaction({id: 4, when: "2011-01-04", amount: 34.2, description: "money money"}),
        ],
        num_records: 2032,
        filters: {
          category: 1
        }
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.selectTransactions(1, 20, {category: 1, account: null})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create transaction page load error action', () => {
    nock('http://localhost:8000')
      .get(/\/api\/transactions\/\?page=.&page_size=../)
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.TRANSACTION_PAGE_LOAD_ERROR, 
        error: {
          code: 404,
          message: [
            [
              "Error", 
              "not found"
            ]
          ]
        },
        page_num: 1
      }
    ]

    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.selectTransactions(1, 20, {})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})