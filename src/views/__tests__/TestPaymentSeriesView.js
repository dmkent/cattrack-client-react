import React from 'react'
import {mount} from 'enzyme'
import Immutable from 'immutable'
import PaymentSeriesView from '../PaymentSeriesView'

function setup() {
  const props = {
    loadPaymentSeries: jest.fn(),
    payment_series: Immutable.Map([[0, {name: "test"}]])
  }

  const enzymeWrapper = mount(<PaymentSeriesView {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('PaymentSeriesView component', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper, props} = setup()

      expect(enzymeWrapper.find('Grid').exists()).toBe(true)
      expect(props.loadPaymentSeries.mock.calls.length).toBe(1)
    })
  })
})