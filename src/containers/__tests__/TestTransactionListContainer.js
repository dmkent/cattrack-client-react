import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/TransactionList'

jest.mock('../../actions/TrackActions', () => ({default: {
  selectTransactions: jest.fn(),
  updateTransaction: jest.fn(),
  categorisorSetTransaction: jest.fn(),
  categorisorShow: jest.fn(),
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
        transactions: new Immutable.OrderedMap(),
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
        categories: new Immutable.List(),
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
      auth: {
        is_logged_in: true
      },
      transactions: new Immutable.OrderedMap(),
      summary: [2],
      filters: {
        category: null
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.onSelectTransactions()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.selectTransactions.mock.calls.length).toBe(1)

    props.updateTransaction()
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.updateTransaction.mock.calls.length).toBe(1)

    props.setCategorisorTransaction()
    expect(dispatch.mock.calls.length).toBe(3)
    expect(TrackActions.categorisorSetTransaction.mock.calls.length).toBe(1)

    props.showCategorisor()
    expect(dispatch.mock.calls.length).toBe(4)
    expect(TrackActions.categorisorShow.mock.calls.length).toBe(1)
  })
})