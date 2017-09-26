import Immutable from 'immutable'
import reducer from '../accounts'
import TrackActionTypes from '../../data/TrackActionTypes'
  
describe('accounts reducer', () => {
  
  it('should return the initial state', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
    expect(reducer(undefined, {})).toEqual(initState)
  })

  it('should handle ACCOUNTS_LOADED', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }

    const expectedState = {
      accounts: Immutable.OrderedMap([
        [
          0, 
          {id: 0, name: "acct1"}
        ],
        [
          1, 
          {id: 1, name: "acct2"}
        ]
      ]),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
    expect(
      reducer(initState, {
        type: TrackActionTypes.ACCOUNTS_LOADED,
        accounts: [
          {id: 0, name: "acct1"},
          {id: 1, name: "acct2"}
        ]
      })
    ).toEqual(expectedState)
  })

  it('should handle ACCOUNTS_LOAD_ERROR', () => {
    expect(reducer({}, {
      type: TrackActionTypes.ACCOUNTS_LOAD_ERROR
    })).toEqual({})
  })
  
  it('should handle ACCOUNT_UPLOAD_STARTED', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
    const expectedState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: true,
      upload_progress: 0,
      upload_result: null,
    }
    expect(reducer(initState, {
      type: TrackActionTypes.ACCOUNT_UPLOAD_STARTED
    })).toEqual(expectedState)
  })

  it('should handle ACCOUNT_UPLOAD_PROGRESS_UPDATE', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: true,
      upload_progress: 0,
      upload_result: null,
    }
    const expectedState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: true,
      upload_progress: 5,
      upload_result: null,
    }
    expect(reducer(initState, {
      type: TrackActionTypes.ACCOUNT_UPLOAD_PROGRESS_UPDATE,
      progress: 5
    })).toEqual(expectedState)
  })

  it('should handle ACCOUNT_UPLOAD_SUCESS', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: true,
      upload_progress: 86,
      upload_result: null,
    }
    const expectedState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: false,
      upload_progress: 100,
      upload_result: "Success",
    }
    expect(reducer(initState, {
      type: TrackActionTypes.ACCOUNT_UPLOAD_SUCESS,
    })).toEqual(expectedState)
  })

  it('should handle ACCOUNT_UPLOAD_PROGRESS_UPDATE', () => {
    const initState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: true,
      upload_progress: 86,
      upload_result: null,
    }
    const expectedState = {
      accounts: Immutable.OrderedMap(),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: "failed to upload",
    }
    expect(reducer(initState, {
      type: TrackActionTypes.ACCOUNT_UPLOAD_ERROR,
      error: {
        message: "failed to upload"
      }
    })).toEqual(expectedState)
  })

  it('should handle ACCOUNT_CREATE_SUCESS', () => {
    const initState = {
      accounts: Immutable.OrderedMap([
        [
          1, 
          {id: 1, name: "acct"}
        ],
        [
          2, 
          {id: 2, name: "acct2"}
        ]
      ]),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
    const expectedState = {
      accounts: Immutable.OrderedMap([
        [
          1, 
          {id: 1, name: "acct"}
        ],
        [
          2, 
          {id: 2, name: "acct2"}
        ],
        [
          3,
          {id: 3, name: "new"}
        ]
      ]),
      upload_in_progress: false,
      upload_progress: 0,
      upload_result: null,
    }
    expect(reducer(initState, {
      type: TrackActionTypes.ACCOUNT_CREATE_SUCCESS,
      account: {id: 3, name: "new"}
    })).toEqual(expectedState)
  })
})