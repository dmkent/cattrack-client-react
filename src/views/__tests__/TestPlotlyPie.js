import React from 'react'
import { mount } from 'enzyme'
import Immutable from 'immutable'
import { toMomentObject } from 'react-dates'
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
import PlotlyPie, {plotlyDataFromSummary} from '../PlotlyPie'

function setup(summary) {
  const props = {
    summary: summary,
  }

  const store = configureStore([])
  const enzymeWrapper = mount((
      <PlotlyPie {...props} />
  ))

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('plotyDataForSummary', () => {
    it('should determine totals, values', () => {
      const summary = Immutable.List([
        {category_name: 'A', total: '-3.5'},
        {category_name: 'B', total: '-2.1'},
        {category_name: 'C', total: '-0.4'},
        {category_name: 'D', total: '0.4'},
        {category_name: 'E', total: '-0.001'},
        {category_name: 'F', total: '-0.001'},
      ])
      const res = plotlyDataFromSummary(summary)
      expect(res.values).toEqual([3.5, 2.1, 0.4, 0.002])
      expect(res.labels).toEqual(['A', 'B', 'C', 'Other'])
    })
  })

  describe('PlotlyPie', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper, props } = setup(Immutable.List())

      expect(enzymeWrapper.find('div').exists()).toBe(true)
      expect(enzymeWrapper.getNode().plot_data[0].values.length).toBe(0)
      enzymeWrapper.setProps({summary: Immutable.List([
        {category_name: 'A', total: '-3.5'},
        {category_name: 'B', total: '-2.1'},
      ])})
      expect(enzymeWrapper.getNode().plot_data[0].values.length).toBe(2)
    })
  })
})