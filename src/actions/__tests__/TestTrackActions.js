import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Account from '../../data/Account'
import Category from '../../data/Category'
import Period from '../../data/Period'
import Transaction from '../../data/Transaction'

import Immutable from 'immutable'
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

  it('should create a logout action', () => {
    let expectedAction = {
      type: TrackActionTypes.AUTH_LOGOUT,
    };
    expect(TrackActions.logout()).toEqual(expectedAction);
  });
})

describe('api actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
  })

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
    auth_expires.setMinutes(auth_expires.setMinutes() + 1)
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
    auth_expires.setMinutes(auth_expires.setMinutes() + 1)
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
    const store = mockStore({...dummyLoggedInState()})

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
      .get(/\/api\/transactions\/\?page=.+&page_size=.+(&.+)?/)
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
          category: 1,
          account: null
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

  it('should create select transactions summary actions', () => {
    nock('http://localhost:8000')
      .get(/\/api\/transactions\/summary\/(\?.+)?/)
      .reply(200, [
        {category: 4, category_name: "c1", total: -34.2},
        {category: 2, category_name: "c4", total: 34.2},
      ]
    )
        
    const expectedActions = [
      { 
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED, 
        summary: [
          {category: 4, category_name: "c1", total: -34.2},
          {category: 2, category_name: "c4", total: 34.2},
        ],
        filters: {
          category: 1,
          account: null,
          from_date: "2011-02-03"
        }
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadTransactionSummary({category: 1, account: null, from_date: "2011-02-03"})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create transaction page load error action', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/summary/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR, 
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

    return store.dispatch(TrackActions.loadTransactionSummary({})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create select transactions summary actions', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/1/suggest/')
      .reply(200, [
        {id: 4, name: "c1"},
        {id: 2, name: "c4"},
      ]
    )
        
    const expectedActions = [
      {
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: {id: 1}
      },
      { 
        type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED, 
        categories: [
          {id: 4, name: "c1"},
          {id: 2, name: "c4"},
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSetTransaction({id: 1})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create suggestion load error action', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/1/suggest/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: {id: 1}
      },
      { 
        type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR, 
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

    return store.dispatch(TrackActions.categorisorSetTransaction({id: 1})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should deal with sequence of actions to reload on edit', () => {
    nock('http://localhost:8000')
      .get(/\/api\/transactions\/summary\/(\?.+)?/)
      .reply(200, [
        {category: 4, category_name: "c1", total: -34.2},
        {category: 2, category_name: "c4", total: 34.2},
      ])
      .get(/\/api\/transactions\/\?page=.+&page_size=.+(&.+)?/)
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
          category: 1,
          account: null,
          to_date: "2011-02-07",
          from_date: "2011-02-03",
        }
      },
      { 
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED, 
        summary: [
          {category: 4, category_name: "c1", total: -34.2},
          {category: 2, category_name: "c4", total: 34.2},
        ],
        filters: {
          category: 1,
          account: null,
          to_date: "2011-02-07",
          from_date: "2011-02-03",
        }
      }
    ]
    const store = mockStore({
      ...dummyLoggedInState(), 
      transactions: {
        page_size: 20,
        filters: {
          category: null,
          account: 1,
          to_date: "2011-02-07",
          from_date: null
        }
      }
    })

    return store.dispatch(TrackActions.updateTransactionFilter({category: 1, account: null, from_date: "2011-02-03"})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
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

  it('should create transactions split actions with no split', () => {
    nock('http://localhost:8000')
      .put('/api/transactions/4/')
      .reply(200, {id: 4, when: "2011-01-01", description: "a", amount: -2})
        
    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_UPDATED,
        transaction: new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2})
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSave(
      new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2}),
      Immutable.List([{category: 2, amount: -2}]),
      () => {}
    )).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create transactions split actions with split', () => {
    nock('http://localhost:8000')
      .put('/api/transactions/4/')
      .reply(200, {id: 4, when: "2011-01-01", description: "a", amount: -2})
      .post('/api/transactions/4/split/')
      .reply(200, {status: 'success'})
        
    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_UPDATED,
        transaction: new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2})
      },
      {
        type: TrackActionTypes.TRANSACTION_SPLIT_SUCCESS
      },
      {
        type: TrackActionTypes.CATEGORISOR_HIDE
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSave(
      new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2}),
      Immutable.List([
        {category: 2, amount: -0.5}, 
        {category: 4, amount: -1.5}
      ]),
      () => {}
    )).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create transactions split error actions with split', () => {
    nock('http://localhost:8000')
      .put('/api/transactions/4/')
      .reply(403, {error: 'failed'})
        
    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_UPDATE_ERROR,
        error: {
          code: 403,
          message: [
            [
              "Error", 
              "failed"
            ]
          ]
        }
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSave(
      new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2}),
      Immutable.List([
        {category: 2, amount: -0.5}, 
        {category: 4, amount: -1.5}
      ]),
      () => {}
    )).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create transactions split error actions with split', () => {
    nock('http://localhost:8000')
      .put('/api/transactions/4/')
      .reply(200, {id: 4, when: "2011-01-01", description: "a", amount: -2})
      .post('/api/transactions/4/split/')
      .reply(403, {error: 'failed'})
        
    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_UPDATED,
        transaction: new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2})
      },
      {
        type: TrackActionTypes.TRANSACTION_SPLIT_ERROR,
        error: {
          code: 403,
          message: [
            [
              "Error", 
              "failed"
            ]
          ]
        }
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSave(
      new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2}),
      Immutable.List([
        {category: 2, amount: -0.5}, 
        {category: 4, amount: -1.5}
      ]),
      () => {}
    )).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })
})