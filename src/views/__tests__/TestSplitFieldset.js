import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import SplitFieldset from '../SplitFieldset'

function setup(valid, message) {
  const props = {
    is_valid: {
      valid: valid,
      message: message
    },
    index: 1,
    multiple_splits_exist: true,
    removeSplitCat: jest.fn(),
    setSplitCategory: jest.fn(),
    setSplitAmount: jest.fn(),
    split: {
      category: "1",
      amount: "-23",
    },
    categories: [
      {id: 0, name: "cat1"},
      {id: 1, name: "cat2"}
    ]
  }

  const enzymeWrapper = shallow(<SplitFieldset {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('SplitFieldSet', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup(null, "")
      expect(enzymeWrapper.find('FormControl').length).toBe(2)
    })
    it('should render self and subcomponents if valid state', () => {
      const {enzymeWrapper} = setup(true, "")
      expect(enzymeWrapper.find('FormControl').length).toBe(2)
    })
    it('should render self and subcomponents if invalid state', () => {
      const {enzymeWrapper} = setup(false, "error")
      expect(enzymeWrapper.find('FormControl').length).toBe(2)
    })
  })
})