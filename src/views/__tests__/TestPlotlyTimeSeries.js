import React from 'react'
import Immutable from 'immutable'
import {mount} from 'enzyme'
import PlotlyTimeSeries, {plotlyDataFromSeries} from '../PlotlyTimeSeries'

function setup(series) {
  const props = {
    series: new Immutable.List(series),
  }
  const enzymeWrapper = mount((
      <PlotlyTimeSeries {...props} />
  ))
  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('plotyDataForSeries', () => {
    it('should reshape series', () => {
      const raw = [
        new Immutable.Map({label: '2013-02-01', value: "-54"}),
        new Immutable.Map({label: '2013-03-01', value: "-3"}),
        new Immutable.Map({label: '2013-04-01', value: "-4"}),
      ]
      const res = plotlyDataFromSeries(raw)
      expect(res.y).toEqual([54, 3, 4])
      expect(res.x).toEqual([
        '2013-02-01', 
        '2013-03-01',
         '2013-04-01'
      ])
    })
  })

  describe('PlotlyTimeSeries', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup([])

      expect(enzymeWrapper.find('div').exists()).toBe(true)
      expect(enzymeWrapper.getNode().plot_data[0].x.length).toBe(0)
      enzymeWrapper.setProps({series: new Immutable.List([
        new Immutable.Map({label: '2013-02-01', value: "-54"}),
        new Immutable.Map({label: '2013-03-01', value: "-3"}),
        new Immutable.Map({label: '2013-04-01', value: "-4"}),
      ])})
      expect(enzymeWrapper.getNode().plot_data[0].x.length).toBe(3)
      enzymeWrapper.setProps({series: new Immutable.List([
        new Immutable.Map({label: '2013-02-01', value: "-54"}),
        new Immutable.Map({label: '2013-03-01', value: "-3"}),
        new Immutable.Map({label: '2013-04-01', value: "-4"}),
      ])})
    })
  })
})