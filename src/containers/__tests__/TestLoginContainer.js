import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/LoginContainer'

jest.mock('../../actions/TrackActions', () => ({
  default: {
    attemptLogin: jest.fn(),
  },
  __esModule: true
}))

describe('LoginContainer', () => {
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
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      auth: {
        is_logged_in: true
      }
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.onLogin()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.attemptLogin.mock.calls.length).toBe(1)
  })
})