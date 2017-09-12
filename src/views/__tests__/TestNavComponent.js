import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import NavComponent from '../NavComponent'

function setup(logged_in) {
  const props = {
    auth: {
      is_logged_in: logged_in,
    }
  }

  const enzymeWrapper = shallow(<NavComponent {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('NavComponent', () => {
    it('should render self and subcomponents when logged out', () => {
      const { enzymeWrapper, props } = setup(false)
      expect(enzymeWrapper.find('NavItem').children().length).toBe(4)
      expect(enzymeWrapper.find('NavItem').at(0).html()).toContain('Dashboard')
      expect(enzymeWrapper.find('NavItem').at(1).html()).toContain('Accounts')
      expect(enzymeWrapper.find('NavItem').at(3).html()).toContain('Login')
    })

    it('should render self and subcomponents when logged in', () => {
      const { enzymeWrapper, props } = setup(true)
      expect(enzymeWrapper.find('NavItem').children().length).toBe(4)
      expect(enzymeWrapper.find('NavItem').at(0).html()).toContain('Dashboard')
      expect(enzymeWrapper.find('NavItem').at(1).html()).toContain('Accounts')
      expect(enzymeWrapper.find('NavItem').at(3).html()).toContain('Logout')
    })
  })
})