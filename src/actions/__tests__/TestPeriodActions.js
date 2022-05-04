import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'
import AuthService from '../../services/auth.service'
import Period from '../../data/Period'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Period actions', () => {
  beforeEach(() => {
    AuthService.dummyLogin()
  })

  afterEach(() => {
    nock.cleanAll()
    localStorage.clear()
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
    const store = mockStore()

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
        error: new Error(["Error: not found"])
      }
    ]

    const store = mockStore()

    return store.dispatch(TrackActions.loadPeriods()).then(() => {
      // Return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

})