import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/AccountsContainer'

jest.mock('../../actions/TrackActions', () => ({
  default: {
    loadAccounts: jest.fn(),
    selectAccount: jest.fn(),
    loadAccountBalanceSeries: jest.fn(),
    createAccount: jest.fn(),
  }, 
  __esModule: true
}))

describe('AccountsContainer', () => {
  it('only have accounts and auth in props', () => {
    const initState = {
      auth: {
        is_logged_in: true
      },
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
      auth: {
        is_logged_in: true,
      },
      accounts: {
        accounts: [1],
        upload_in_progress: false,
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.loadAccounts()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.loadAccounts.mock.calls.length).toBe(1)

    props.selectAccount({id: 3, name: "test"})
    expect(dispatch.mock.calls.length).toBe(3)
    expect(TrackActions.selectAccount.mock.calls.length).toBe(1)
    expect(TrackActions.loadAccountBalanceSeries.mock.calls.length).toBe(1)

    props.createAccount("test2")
    expect(dispatch.mock.calls.length).toBe(4)
    expect(TrackActions.createAccount.mock.calls.length).toBe(1) 
  })
})