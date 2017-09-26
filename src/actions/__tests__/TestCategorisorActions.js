import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Transaction from '../../data/Transaction'
import Category from '../../data/Category'

import Immutable from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Categorisor actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
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

  it('should create transactions split actions with no split', () => {
    nock('http://localhost:8000')
      .put('/api/transactions/4/')
      .reply(200, {id: 4, when: "2011-01-01", description: "a", amount: -2})
        
    const expectedActions = [
      {
        type: TrackActionTypes.TRANSACTION_UPDATED,
        transaction: new Transaction({id: 4, when: "2011-01-01", description: "a", amount: -2})
      },
      {
        type: TrackActionTypes.CATEGORISOR_HIDE
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

  it('should create transactions update error actions with split', () => {
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