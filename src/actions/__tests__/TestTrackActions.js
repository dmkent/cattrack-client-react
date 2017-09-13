import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import Category from '../../data/Category'
import Period from '../../data/Period'
import Immutable from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import TestUtils from '../../../utils/test_utils';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

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
      .get('/api/categories')
      .reply(200, [
        {"url":"http://localhost:8000/api/categories/48/","id":48,"name":"Bank - Fees"},
        {"url":"http://localhost:8000/api/categories/15/","id":15,"name":"Bank - Interest"},
        {"url":"http://localhost:8000/api/categories/3/","id":3,"name":"Caffeine"},
      ])
        
    const expectedActions = [
      { type: TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED, 
        categories: [
          Category({id: 48, name: "Bank - Fees"}),
          Category({id: 15, name: "Bank - Interest"}),
          Category({id: 3, name: "Caffeine"})
        ]
      }
    ]
    const store = mockStore({ auth: {token: '' }})

    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load category error action', () => {
    nock('http://localhost:8000')
      .get('/api/categories')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR, 
        error: {
          code: 404,
          message: [["Error", "not found"]]
        }
      }
    ]
    const store = mockStore({ auth: {token: '' }})

    return store.dispatch(TrackActions.loadCategories()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should create load period actions', () => {
    nock('http://localhost:8000')
      .get('/api/periods/')
      .reply(200, [
        {id: 4, label: "Last month", from_date: "2011-01-02", to_date: "2011-02-02", offset: "1"},
        {id:1, label: "Last week", from_date: "2011-01-24", to_date: "2011-02-02", offset: "1"},
      ])
        
    const expectedActions = [
      { type: TrackActionTypes.PERIODS_LOADED, 
        periods: [
          Period({id: 4, label: "Last month", offset: "1", from_date: "2011-01-02", to_date: "2011-02-02"}),
          Period({id: 1, label: "Last week", from_date: "2011-01-24", to_date: "2011-02-02", offset: "1"}),
        ]
      }
    ]
    const auth_expires = new Date()
    auth_expires.setHours(auth_expires.getHours() + 1)
    const store = mockStore({ auth: {token: '', is_logged_in: true, expires: auth_expires}})

    return store.dispatch(TrackActions.loadPeriods()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load period error action', () => {
    nock('http://localhost:8000')
      .get('/api/periods/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { type: TrackActionTypes.PERIODS_LOAD_ERROR, 
        error: {
          code: 404,
          message: [["Error", "not found"]]
        }
      }
    ]
    const auth_expires = new Date()
    auth_expires.setHours(auth_expires.getHours() + 1)
    const store = mockStore({ auth: {token: '', is_logged_in: true, expires: auth_expires}})

    return store.dispatch(TrackActions.loadPeriods()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})