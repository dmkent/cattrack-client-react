import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/TransactionFilterPeriodsContainer'

jest.mock('../../actions/TrackActions', () => ({default: {
  loadAccounts: jest.fn(),
  loadPeriods: jest.fn(),
  updateTransactionFilter: jest.fn(),
}, __esModule: true}))

describe('TransactionFilterPeriodsContainer', () => {
  it('only have correct state in props', () => {
    const initState = {
      app: {
        title: "test"
      },
      auth: {
        is_logged_in: true
      },
      transactions: {
        transactions: Immutable.OrderedMap(),
        summary: [2],
        filters: {
          category: null
        }
      },
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
      },
      errors: {
        next_error: 1,
        errors: [5]
      },
      periods: [2]
    }
    expect(mapStateToProps(initState)).toEqual({
      categories: Immutable.List(),
      accounts: [1],
      periods: [2],
      filters: {
        category: null
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.loadAccounts()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.loadAccounts.mock.calls.length).toBe(1)

    props.loadPeriods()
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.loadPeriods.mock.calls.length).toBe(1)

    props.onFilter()
    expect(dispatch.mock.calls.length).toBe(3)
    expect(TrackActions.updateTransactionFilter.mock.calls.length).toBe(1)
  })
})