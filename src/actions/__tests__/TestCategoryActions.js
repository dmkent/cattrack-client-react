import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Category actions', () => {
  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
  })

  it('should create load category series actions', () => {
    nock('http://localhost:8000')
      .get('/api/categories/2/series/')
      .reply(200, [
        {label: "2010-01-01", value: -34},
        {label: "2010-02-01", value: -54},
      ])
        
    const expectedActions = [
      { 
        type: TrackActionTypes.CATEGORY_SERIES_LOADED, 
        series: [
          {label: "2010-01-01", value: -34},
          {label: "2010-02-01", value: -54},
        ]
      }
    ]
    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadCategorySeries(2, {})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqualImmutable(expectedActions)
    })
  })

  it('should create load category series error action', () => {
    nock('http://localhost:8000')
      .get('/api/categories/3/series/')
      .reply(404, {error: "not found"})
        
    const expectedActions = [
      { 
        type: TrackActionTypes.CATEGORY_SERIES_LOAD_ERROR, 
        error: new Error(["Error: not found"])
      }
    ]

    const store = mockStore({...dummyLoggedInState()})

    return store.dispatch(TrackActions.loadCategorySeries(3, {})).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

})