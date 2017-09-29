import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import Accounts from '../Accounts'

function setup(accounts, account_id, uploading) {
  const props = {
    accounts: {
      accounts: Immutable.OrderedMap(accounts),
      upload_in_progress: uploading
    },
    uploadToAccount: jest.fn(),
    loadAccounts: jest.fn(),
    createAccount: jest.fn()
  }

  const enzymeWrapper = shallow(<Accounts {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Accounts', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup([[0, {id: 0, name: "acct1"}]], 0, false)

      expect(enzymeWrapper.find('tr').length).toBe(1)
    })

    it('should call selectAccount when row clicked', () => {
      const {enzymeWrapper} = setup([
        [0, {id: 0, name: "acct1"}], 
        [1, {id: 1, name: "acct2"}]
      ], 0, false)

      // Click a row
      enzymeWrapper.find('tr')
        .at(1)
        .simulate('click', {
          target: {
            tagName: 'TR',
            getAttribute: () => ('1')
          }
        })
      expect(enzymeWrapper.state('selected_account')).toBe('1')

      // Click a cell
      enzymeWrapper.find('tr')
      .at(0)
      .simulate('click', {
        target: {
          tagName: 'TD',
          getAttribute: () => ('0'),
          parentNode: {
            tagName: 'TR',
            getAttribute: () => ('0')
          }
        }
      })
      expect(enzymeWrapper.state('selected_account')).toBe('0')
    })

    it('should call show popover with form when add button clicked', () => {
      const {enzymeWrapper, props} = setup([[0, {id: 0, name: "acct1"}]], 0, false)

      // Click a row
      enzymeWrapper.find('Button').at(0)
        .simulate('click', {
          target: {}
        })
      expect(enzymeWrapper.find('OverlayTrigger').exists()).toBeTruthy()
      const overlay = shallow(enzymeWrapper.find('OverlayTrigger').prop('overlay'))
      expect(enzymeWrapper.state('newname')).toBe('')
      overlay.find('FormControl').simulate('change', {
        target: {value: 'testname'}
      })
      expect(enzymeWrapper.state('newname')).toBe('testname')

      expect(props.createAccount.mock.calls.length).toBe(0)
      overlay.find('Button').simulate('click')
      expect(props.createAccount.mock.calls[0]).toEqual(['testname'])
      
    })
  })
})