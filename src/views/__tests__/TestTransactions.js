import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import {FormattedDate} from 'react-intl'
import Transactions from '../Transactions'

function setup(transactions) {
  const props = {
    page_size: 20,
    filters: {},
    active_page: 1,
    onSelectTransactions: jest.fn(),
    setCategorisorTransaction: jest.fn(),
    showCategorisor: jest.fn(),
    transactions: new Immutable.List(transactions),
  }

  const enzymeWrapper = shallow(<Transactions {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Transactions', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper, props} = setup([])

      expect(enzymeWrapper.find('tbody').children()
        .exists()).toBe(false)
      expect(props.onSelectTransactions.mock.calls.length).toBe(1)
    })

    it('should display some transactions', () => {
      const {enzymeWrapper, props} = setup([
          {id: 0, when: new Date("2017-01-01"), description: "Test this", amount: -90.9},
          {
            id: 1, 
            when: new Date("2017-01-02"), 
            description: "Test this really,  really,  really,  really,  really,  really long description",
            amount: -90.9
          }
      ])

      expect(enzymeWrapper.find('tbody').children().length).toBe(2)
      let tableRow = enzymeWrapper.find('tbody').children()
        .at(0)
      expect(tableRow.children().at(0)
        .children()
        .first()
        .type()).toBe(FormattedDate)
      expect(tableRow.children().at(1)
        .find('span')
        .text()).toBe("Test this")
      expect(tableRow.children().at(2)
        .text()).toBe("-90.9")
      tableRow.find('Button').at(1)
        .props()
        .onClick()
      expect(props.setCategorisorTransaction.mock.calls.length).toBe(1)
      expect(props.showCategorisor.mock.calls.length).toBe(1)

      tableRow = enzymeWrapper.find('tbody').children()
        .at(1)
      expect(tableRow.children().at(1)
        .find('span')
        .text()).toBe(
        "Test this really,  really,  really,  really,  real..."
      )

      enzymeWrapper.find('Pagination').props()
        .onSelect()
      expect(props.onSelectTransactions.mock.calls.length).toBe(2)

      enzymeWrapper.instance().reloadPage()
      expect(props.onSelectTransactions.mock.calls.length).toBe(3)
    })
  })

  it('should render as null if transactions are undefined', () => {
    const props = {
      onSelectTransactions: jest.fn(),
      setCategorisorTransaction: jest.fn(),
      showCategorisor: jest.fn(),
    }
    const enzymeWrapper = shallow(<Transactions {...props}/>)

    expect(enzymeWrapper.children().exists()).toBeFalsy()
  })
})