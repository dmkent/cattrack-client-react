import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../PaymentSeriesContainer'

jest.mock('../../actions/TrackActions', () => ({
  default: {
    loadPaymentSeries: jest.fn(),
    selectPaymentSeries: jest.fn(),
  },
  __esModule: true
}))

describe('PaymentSeriesContainer', () => {
  it('only have correct state in props', () => {
    const initState = {
      app: {
        title: "test"
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
      periods: [2],
      bills: {
        payment_series: [5]
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      payment_series: [5]
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.loadPaymentSeries()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.loadPaymentSeries.mock.calls.length).toBe(1)

    props.selectPaymentSeries(0)
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.selectPaymentSeries.mock.calls.length).toBe(1)
  })
})