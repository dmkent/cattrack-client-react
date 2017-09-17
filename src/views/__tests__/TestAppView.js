import React from 'react'
import { shallow, mount } from 'enzyme'
import AppView, {PrivateRoute, ContentView, Logout, LogoutContainer} from '../AppView'
import { Route, Redirect } from 'react-router-dom'
import configureStore from 'redux-mock-store'

function setup() {
  const props = {
    auth: {},
    version: 'test',
    restoreLogin: jest.fn(),
    title: 'testtitle',
  }

  const enzymeWrapper = shallow(<AppView {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('AppView', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find('div').children().exists()).toBe(true)
    })
  })

  describe('ContentView', () => {
    it('should render self and subcomponents', () => {
      const enzymeWrapper = shallow(<ContentView/>)

      expect(enzymeWrapper.find('Route').length).toBe(2)
      expect(enzymeWrapper.find('PrivateRoute').length).toBe(3)
    })
  })

  describe('Logout', () => {
    it('should render self and subcomponents', () => {
      const enzymeWrapper = shallow(<Logout logout={jest.fn()}/>)
      expect(enzymeWrapper.find('Redirect').length).toBe(1)
    })
  })


describe('LogoutContainer', () => {
    it('should render self and subcomponents', () => {
      const store = configureStore([])
      const enzymeWrapper = shallow(<LogoutContainer store={store()}/>)
      expect(enzymeWrapper.find('Logout').length).toBe(1)
    })
  })

  describe('PrivateRoute', () => {
    it('should render redirect if logged out', () => {
      const res = PrivateRoute({component: () => {}, auth: {is_logged_in: false}})
      expect(res.type).toBe(Route)
      expect(res.props.render({location: '/'}).type).toBe(Redirect)
    })

    it('should render component if logged in', () => {
      const res = PrivateRoute({component: "div", auth: {is_logged_in: true}})
      expect(res.type).toBe(Route)
      expect(res.props.render({location: '/'})).toEqual(<div location={'/'}/>)
    })


    it('should render with render func if logged in', () => {
      const res = PrivateRoute({render: (props) => {return <div/>}, auth: {is_logged_in: true}})
      expect(res.type).toBe(Route)
      expect(res.props.render({location: '/'})).toEqual(<div/>)
    })
  })

})