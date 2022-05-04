import React from 'react'
import {shallow} from 'enzyme'
import Login from '../Login'

function setup() {
  const props = {}

  const enzymeWrapper = shallow(<Login {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Login', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup()

      expect(enzymeWrapper.find('label').length).toBe(2)
    })
  })
})