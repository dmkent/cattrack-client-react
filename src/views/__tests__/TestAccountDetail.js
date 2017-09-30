import React from 'react'
import {shallow} from 'enzyme'
import Immutable from 'immutable'
import AccountDetail from '../AccountDetail'

function setup(accounts, account_id, uploading) {
  const props = {
    accounts: {
      accounts: Immutable.OrderedMap(accounts),
      upload_in_progress: uploading
    },
    account: account_id,
    uploadToAccount: jest.fn(),
    loadAccountBalanceSeries: jest.fn(),
  }

  const enzymeWrapper = shallow(<AccountDetail {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('AccountDetail', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, false)

      expect(enzymeWrapper.find('Form').length).toBe(1)
    })

    it('should render progress bar when uploading', () => {
      const {enzymeWrapper} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, true)

      expect(enzymeWrapper.find('ProgressBar').length).toBe(1)
    })

    it('should call uploadToAccount when form submitted', () => {
      const {enzymeWrapper, props} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, false)
      const form = enzymeWrapper.find('Form')
      form.props().onSubmit({preventDefault: jest.fn()})
      expect(props.uploadToAccount.mock.calls.length).toBe(1)
    })

    it('should call handleChange events', () => {
      const {enzymeWrapper} = setup([
        [
          0,
          {id: 0, name: "acct1"}
        ]
      ], 0, false)
      enzymeWrapper.find('FormControl').props()
        .onChange({
          preventDefault: jest.fn(),
          target: {
            name: "upload_file",
            value: "test",
            files: ["file1"]
          }
        })
      expect(enzymeWrapper.state('upload_file')).toBe('file1')
    })
  })
})