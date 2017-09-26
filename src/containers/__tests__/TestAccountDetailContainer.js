import React from 'react'
import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/AccountDetailContainer'

jest.mock('../../actions/TrackActions', () => ({default: {
  uploadToAccount: jest.fn(),
}, __esModule: true}))

describe('AccountDetailContainer', () => {
  it('only have accounts in props', () => {
    const initState = {
      transactions: Immutable.OrderedMap(),
      categories: {
        is_valid: {
          valid: null,
          message: ""
        },
        show_categorisor: false,
        categories: Immutable.List(),
      },
      accounts: {
        accounts: [1],
        upload_in_progress: false
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      accounts: {
        accounts: [1],
        upload_in_progress: false,
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.uploadToAccount()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.uploadToAccount.mock.calls.length).toBe(1)
  })
})