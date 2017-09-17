import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import Login from '../Login'

function setup(is_logged_in, from_state) {
  const props = {
    location: {
      state: from_state   
    },
    history: {},
    auth: {
      is_logged_in: is_logged_in,
    },
    onLogin: jest.fn(),
  }

  const enzymeWrapper = shallow(<Login {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Login', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper, props } = setup(false, '/')

      expect(enzymeWrapper.find('FormControl').length).toBe(2)
      expect(props.onLogin.mock.calls.length).toBe(0)
      enzymeWrapper.find('Form').simulate("submit", {preventDefault: () => {}})
      expect(props.onLogin.mock.calls.length).toBe(1)

      expect(enzymeWrapper.state("username")).toEqual("")
      enzymeWrapper.find('FormControl').at(0).simulate('change', {
        target: {
          name: "username",
          value: "test"
        }
      })
      expect(enzymeWrapper.state("username")).toEqual("test")
    })

    it('should redirect if already logged in', () => {
      const { enzymeWrapper } = setup(true, '/')

      expect(enzymeWrapper.find('Redirect').length).toBe(1)
    })

    it('should redirect to / if last was /login', () => {
      const { enzymeWrapper } = setup(true, '/login')

      expect(enzymeWrapper.find('Redirect').length).toBe(1)
      expect(enzymeWrapper.find('Redirect').props().to).toBe('/')
    })

    it('should redirect to given route', () => {
      const { enzymeWrapper } = setup(true, {from: '/somewhere'})

      expect(enzymeWrapper.find('Redirect').length).toBe(1)
      expect(enzymeWrapper.find('Redirect').props().to).toBe('/somewhere')
    })

    it('should redirect to / by default', () => {
      const { enzymeWrapper } = setup(true)

      expect(enzymeWrapper.find('Redirect').length).toBe(1)
      expect(enzymeWrapper.find('Redirect').props().to).toBe('/')
    })
  })
})