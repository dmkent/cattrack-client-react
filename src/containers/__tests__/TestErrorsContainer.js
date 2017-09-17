import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/ErrorsContainer'

jest.mock('../../actions/TrackActions', () => ({default: {
  clearError: jest.fn(),
}, __esModule: true}))

describe('DashboardContainer', () => {
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
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      errors: {
        next_error: 1,
        errors: [5]
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.handleAlertDismiss()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.clearError.mock.calls.length).toBe(1)
  })
})