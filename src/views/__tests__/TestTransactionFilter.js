import React from 'react'
import {mount} from 'enzyme'
import Immutable from 'immutable'
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store'
import TransactionFilter from '../TransactionFilter'

function setup(accounts, categories, filters) {
  const props = {
    loadAccounts: jest.fn(),
    onFilter: jest.fn(),
    filters: filters,
    accounts: new Immutable.List(accounts),
    categories: new 
    Immutable.List(categories),
  }

  const store = configureStore([])
  const enzymeWrapper = mount(<Provider store={store({
    categories: props.categories,
    accounts: props.accounts,
    transactions: {
      filters: props.filters,
    },
    periods: [],
  })}><TransactionFilter {...props} /></Provider>)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('TransactionFilter', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper, props} = setup([], [], {})

      expect(enzymeWrapper.find('DateRangePicker').exists()).toBe(true)
      expect(props.loadAccounts.mock.calls.length).toBe(1)
    })

    it('should display some categories and accounts', () => {
      const {enzymeWrapper, props} = setup([
        {id: 0, name: "account 1"},
        {id: 1, name: "account 2"}
      ], [
        {id: 0, name: "Cat1"},
        {id: 3, name: "Cat2"}
      ], {to_date: null, from_date: null, category: null, account: null})
      expect(enzymeWrapper.find('Button').at(3)
        .text()).toBe("Cat1")
      expect(enzymeWrapper.find('Button').at(3)
        .props().active).toBe(false)
      expect(enzymeWrapper.find('Button').at(4)
        .text()).toBe("Cat2")
      expect(enzymeWrapper.find('Button').at(4)
        .props().active).toBe(false)
      enzymeWrapper.find('Button').at(3)
        .props()
        .onClick()
      expect(props.onFilter.mock.calls.length).toBe(1)

      // Click on account
      enzymeWrapper.find('Button').at(5)
        .props()
        .onClick()
      expect(props.onFilter.mock.calls.length).toBe(2)
    })

    it('should display some periods and set active', () => {
      const {enzymeWrapper, props} = setup([
        {id: 0, name: "account 1"},
        {id: 1, name: "account 2"}
      ], [
        {id: 0, name: "Cat1"},
        {id: 3, name: "Cat2"}
      ], {to_date: null, from_date: null, category: 3, account: 0})
      expect(enzymeWrapper.find('Button').at(4)
        .text()).toBe("Cat2")
      expect(enzymeWrapper.find('Button').at(4)
        .props().active).toBe(true)

      // Reset to "All"
      enzymeWrapper.find('Button').at(1)
        .props()
        .onClick()
      expect(props.onFilter.mock.calls.length).toBe(1)
      expect(props.onFilter.mock.calls[0][0]).toEqual({
        category: null,
        has_category: null
      })

      // Reset account to "All"
      enzymeWrapper.find('Button').at(5)
        .props()
        .onClick()
      expect(props.onFilter.mock.calls.length).toBe(2)
      expect(props.onFilter.mock.calls[1][0]).toEqual({account: null})
    })
  })
})