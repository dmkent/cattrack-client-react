import Immutable from 'immutable'
import reducer from '../periods'
import TrackActionTypes from '../../data/TrackActionTypes'
  
describe('transactions reducer', () => {
  
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(new Immutable.List())
  })

  it('should handle PERIODS_LOADED', () => {
    const initState = new Immutable.List()

    const expectedState = new Immutable.List([ 
        {id: 0, from_date: "2001-01-01", to_date: "2002-01-01", label: "last year"},
        {id: 0, from_date: "2002-01-01", to_date: "2003-01-01", label: "this year"},
    ])

    expect(
      reducer(initState, {
        type: TrackActionTypes.PERIODS_LOADED,
        periods: [
          {id: 0, from_date: "2001-01-01", to_date: "2002-01-01", label: "last year"},
          {id: 0, from_date: "2002-01-01", to_date: "2003-01-01", label: "this year"},
        ],
      })
    ).toEqual(expectedState)
  })

  it('should handle PERIODS_LOAD_ERROR', () => {
    expect(
      reducer({}, {
        type: TrackActionTypes.PERIODS_LOAD_ERROR,
      })
    ).toEqual({})
  })
})