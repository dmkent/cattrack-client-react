import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/AppContainer'

jest.mock('../../actions/TrackActions', () => ({default: {
  attemptLogin: jest.fn(),
  restoreLogin: jest.fn(),
}, __esModule: true}))

describe('AppContainer', () => {
  it('only have correct state in props', () => {
    const initState = {
      app: {
        title: "test"
      },
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
      title: "test"
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.onLogin()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.attemptLogin.mock.calls.length).toBe(1)

    props.restoreLogin()
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.restoreLogin.mock.calls.length).toBe(1)
  })
})