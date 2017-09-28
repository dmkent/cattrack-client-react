import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Transaction from '../../data/Transaction'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('Transaction actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
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
        error: new Error(["Error: not found"]),
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

  it('should create transaction summary load error action', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/summary/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR, 
        error: new Error(["Error: not found"])
      }
    ]

    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadTransactionSummary({})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create category suggestion received actions', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/1/suggest')
      .reply(200, [
        {id: 4, name: "c1", score: 8},
        {id: 2, name: "c4", score: 2},
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
          {id: 4, name: "c1", score: 8},
          {id: 2, name: "c4", score: 2},
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.categorisorSetTransaction({id: 1})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create category suggestion error action', () => {
    nock('http://localhost:8000')
      .get('/api/transactions/1/suggest')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      {
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: {id: 1}
      },
      { 
        type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR, 
        error: new Error(["Error: not found"])
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
})