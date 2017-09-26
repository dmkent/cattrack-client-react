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
      const {enzymeWrapper} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, false)

      expect(enzymeWrapper.find('tr').length).toBe(1)
    })

    it('should call selectAccount when row clicked', () => {
      const {enzymeWrapper} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, false)

      // Click a row
      enzymeWrapper.find('tr')
        .simulate('click', {
          target: {
            tagName: 'TR',
            getAttribute: () => ('0')
          }
        })
      expect(enzymeWrapper.state('selected_account')).toBe('0')
    })
  })
})