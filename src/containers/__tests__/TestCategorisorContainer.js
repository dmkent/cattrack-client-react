import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps} from '../../containers/CategorisorContainer'

jest.mock('../../actions/TrackActions', () => ({
  default: {
    categorisorHide: jest.fn(),
    categorisorSave: jest.fn(),
    loadCategories: jest.fn(),
    updateTransaction: jest.fn(),
    categorisorAddSplit: jest.fn(),
    categorisorRemoveSplit: jest.fn(),
    categorisorSetSplit: jest.fn()
  },
  __esModule: true
}))

describe('CategorisorContainer', () => {
  it('only have categorisor in props', () => {
    const initState = {
      transactions: Immutable.OrderedMap(),
      categories: {
        is_valid: {
          valid: null,
          message: ""
        },
        show_categorisor: false,
        categories: Immutable.List(),
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      categories: Immutable.List()
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    props.hideCategorisor()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.categorisorHide.mock.calls.length).toBe(1)

    props.saveCategorisor({id: 0}, [], jest.fn())
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.categorisorSave.mock.calls.length).toBe(1)

    props.loadCategories()
    expect(dispatch.mock.calls.length).toBe(3)
    expect(TrackActions.loadCategories.mock.calls.length).toBe(1)

    props.updateTransaction()
    expect(dispatch.mock.calls.length).toBe(4)
    expect(TrackActions.updateTransaction.mock.calls.length).toBe(1)

    props.addPotentialSplit()
    expect(dispatch.mock.calls.length).toBe(5)
    expect(TrackActions.categorisorAddSplit.mock.calls.length).toBe(1)

    props.removePotentialSplit(1)
    expect(dispatch.mock.calls.length).toBe(6)
    expect(TrackActions.categorisorRemoveSplit.mock.calls.length).toBe(1)

    props.setSplit("name", 0, {target: {}})
    expect(dispatch.mock.calls.length).toBe(7)
    expect(TrackActions.categorisorSetSplit.mock.calls.length).toBe(1)
  })
})