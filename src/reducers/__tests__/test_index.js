import reducer from '../index'
  
describe('combined reducer', () => {
  
  it('should return the initial state', () => {
    expect(Object.keys(reducer(undefined, {}))).toEqual([
      'app',
      'auth',
      'transactions',
      'accounts',
      'categories',
      'periods',
      'errors',
      'category',
    ])

    expect(reducer(undefined, {}).app).toEqual({
      title: 'CatTrack',
      version: '2.0'
    })
  })
})