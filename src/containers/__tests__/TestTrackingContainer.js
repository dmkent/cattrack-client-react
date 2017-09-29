import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import TrackActions from '../../actions/TrackActions'
import {mapStateToProps, mapDispatchToProps, Tracking} from '../../containers/TrackingContainer'

jest.mock('../../actions/TrackActions', () => ({
  default: {
    loadCategories: jest.fn(),
    loadCategorySeries: jest.fn(),
  },
  __esModule: true
}))

describe('TrackingContainer', () => {
  it('only have categorisor and series in props', () => {
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
      category: {
        series: Immutable.List()
      }
    }
    expect(mapStateToProps(initState)).toEqual({
      categories: Immutable.List(),
      series: Immutable.List()
    })
  })

  it('maps dispatch to props', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)

    props.loadCategories()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(TrackActions.loadCategories.mock.calls.length).toBe(1)

    props.loadCategorySeries(1, {})
    expect(dispatch.mock.calls.length).toBe(2)
    expect(TrackActions.loadCategorySeries.mock.calls.length).toBe(1)
  })
})

describe('Tracking', () => {
  it('should render self and subcomponents', () => {
    const props = {
      series: Immutable.List([
          Immutable.Map({value: '-43', label: '2013-01-01'}),
          Immutable.Map({value: '-33', label: '2013-02-01'}),
          Immutable.Map({value: '-5', label: '2013-03-01'}),
        ]),
      categories: Immutable.List([
        {id: 3, name: 'cat1'},
        {id: 2, name: 'cat2'},
        {id: 1, name: 'cat3'},
      ]),
      loadCategories: jest.fn(),
      loadCategorySeries: jest.fn(),
    }
    const enzymeWrapper = shallow(<Tracking {...props} />)

    expect(enzymeWrapper.find('option').length).toBe(3)
    expect(enzymeWrapper.find('Connect').exists()).toBeTruthy()
    
    expect(props.loadCategorySeries.mock.calls.length).toBe(0)
    enzymeWrapper.find('select').simulate('change', {
      target: {
        value: 1
      }
    })
    expect(props.loadCategorySeries.mock.calls.length).toBe(1)
  })
})