import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import Categorisor from '../Categorisor'

function setup(transaction, suggestions) {
  const props = {
    transaction: transaction,
    suggestions: suggestions ? suggestions : Immutable.List(),
    splits: Immutable.List([
      'split',
      'split2'
    ]),
    categories: Immutable.List(),
    is_valid: {message: null, valid: null},
    showCategorisor: jest.fn(),
    saveCategorisor: jest.fn(),
    hideCategorisor: jest.fn(),
    removePotentialSplit: jest.fn(),
    addPotentialSplit: jest.fn(),
    setSplit: jest.fn(),
    reloadPage: jest.fn(),
  }

  const enzymeWrapper = shallow(<Categorisor {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Categorisor', () => {
    it('should not render if transaction is null or undefined', () => {
      let {enzymeWrapper} = setup(null)
      expect(enzymeWrapper.find('Modal').exists()).toBe(false)

      enzymeWrapper = setup().enzymeWrapper
      expect(enzymeWrapper.find('Modal').exists()).toBe(false)
    })

    it('should render if transaction is defined', () => {
      let {enzymeWrapper} = setup({
        description: "test",
        when: "2012-01-01",
        amount: -34.4,
      })
      expect(enzymeWrapper.find('Modal').exists()).toBe(true)
    })

    it('should render suggestions if defined', () => {
      let {enzymeWrapper} = setup({
        description: "test",
        when: "2012-01-01",
        amount: -34.4,
      }, Immutable.List([
        {name: 'suggest1'},
        {name: 'suggest2'}
      ]))
      expect(enzymeWrapper.find('Modal').exists()).toBe(true)
      expect(enzymeWrapper.find('li').at(0)
             .text()).toEqual('suggest1 <Badge />')
      expect(enzymeWrapper.find('li').at(1)
             .text()).toEqual('suggest2 <Badge />')
    })

    it('should call save on button click', () => {
      let {enzymeWrapper, props} = setup({
        description: "test",
        when: "2012-01-01",
        amount: -34.4,
      })
      expect(props.saveCategorisor.mock.calls.length).toBe(0)
      enzymeWrapper.find('Button').at(3)
        .simulate('click')
      expect(props.saveCategorisor.mock.calls.length).toBe(1)
    })

    it('should call split on change', () => {
      let {enzymeWrapper, props} = setup({
        description: "test",
        when: "2012-01-01",
        amount: -34.4,
      })
      expect(props.setSplit.mock.calls.length).toBe(0)
      enzymeWrapper.find('SplitFieldset').at(0)
        .props()
        .setSplitCategory({})
      expect(props.setSplit.mock.calls.length).toBe(1)

      enzymeWrapper.find('SplitFieldset').at(0)
        .props()
        .setSplitAmount({})
      expect(props.setSplit.mock.calls.length).toBe(2)
    })

    it('should show alert if not valid', () => {
      let {enzymeWrapper} = setup({
        description: "test",
        when: "2012-01-01",
        amount: -34.4,
      })
      expect(enzymeWrapper.find('Alert').exists()).toBe(false)
      enzymeWrapper.setProps({is_valid: {message: "invalid", valid: false}})
      expect(enzymeWrapper.find('Alert').exists()).toBe(true)      
    })
  })
})