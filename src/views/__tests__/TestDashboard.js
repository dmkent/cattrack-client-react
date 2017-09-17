import React from 'react'
import {shallow} from 'enzyme'
import Dashboard from '../Dashboard'

function setup() {
  const props = {
    auth: {
      is_logged_in: true,
    },
    filters: {
      category: null
    },
    summary: [2]
  }

  const enzymeWrapper = shallow(<Dashboard {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Dashboard', () => {
    it('should render self and subcomponents', () => {
      const {enzymeWrapper} = setup()

      expect(enzymeWrapper.find('Col').length).toBe(2)
    })
  })
})