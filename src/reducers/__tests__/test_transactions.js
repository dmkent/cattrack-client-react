import Immutable from 'immutable'
import reducer from '../transactions'
import TrackActionTypes from '../../data/TrackActionTypes'
  
describe('transactions reducer', () => {
  
  it('should return the initial state', () => {
    const initState = {
      active_page: 1,
      num_pages: 1,
      page_size: 20,
      transactions: new Immutable.OrderedMap(),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }
    expect(reducer(undefined, {})).toEqual(initState)
  })

  it('should handle TRANSACTION_UPDATED', () => {
    const initState = {
      active_page: 1,
      num_pages: 1,
      page_size: 20,
      transactions: new Immutable.OrderedMap([
        [
          0, 
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"}
        ]
      ]),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }

    const expectedState = {
      active_page: 1,
      num_pages: 1,
      page_size: 20,
      transactions: new Immutable.OrderedMap([
        [
          0, 
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"}
        ]
      ]),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }
    expect(
      reducer(initState, {
        type: TrackActionTypes.TRANSACTION_UPDATED,
        transaction: {id: 0, when: "2001-01-01", amount: "-43", category: "5", description: "test"}
      })
    ).toEqual(expectedState)
  })

  it('should handle TRANSACTION_PAGE_LOAD', () => {
    const initState = {
      active_page: 1,
      num_pages: 1,
      page_size: 20,
      transactions: new Immutable.OrderedMap(),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }

    const expectedState = {
      active_page: 2,
      num_pages: 2,
      page_size: 20,
      transactions: new Immutable.OrderedMap([
        [
          0, 
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"}
        ],
        [
          1, 
          {id: 1, when: "2001-01-02", amount: "-4", category: "4", description: "test2"}
        ]
      ]),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }
    expect(
      reducer(initState, {
        type: TrackActionTypes.TRANSACTION_PAGE_LOADED,
        page_num: 2,
        num_records: 40,
        transactions: [
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"},
          {id: 1, when: "2001-01-02", amount: "-4", category: "4", description: "test2"}
        ],
        filters: {
          account: null,
          category: null,
          from_date: null,
          to_date: null
        }
      })
    ).toEqual(expectedState)
  })

  it('should handle TRANSACTION_SUMMARY_LOADED', () => {
    const initState = {
      active_page: 2,
      num_pages: 2,
      page_size: 20,
      transactions: new Immutable.OrderedMap([
        [
          0, 
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"}
        ],
        [
          1, 
          {id: 1, when: "2001-01-02", amount: "-4", category: "4", description: "test2"}
        ]
      ]),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap(),
    }

    const expectedState = {
      active_page: 2,
      num_pages: 2,
      page_size: 20,
      transactions: new Immutable.OrderedMap([
        [
          0, 
          {id: 0, when: "2001-01-01", amount: "-43", category: "3", description: "test"}
        ],
        [
          1, 
          {id: 1, when: "2001-01-02", amount: "-4", category: "4", description: "test2"}
        ]
      ]),
      filters: {
        account: null,
        category: null,
        from_date: null,
        to_date: null
      },
      summary: new Immutable.OrderedMap([
        [
          0,
          {category: 0, total: "-34", category_name: "cat1"}
        ],
        [
          1,
          {category: 1, total: "-3", category_name: "cat2"}
        ]
      ]),
    }
    expect(
      reducer(initState, {
        type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED,
        summary: [
          {category: 0, total: "-34", category_name: "cat1"},
          {category: 1, total: "-3", category_name: "cat2"}
        ],
        filters: {
          account: null,
          category: null,
          from_date: null,
          to_date: null
        }
      })
    ).toEqual(expectedState)
  })

  it('should handle TRANSACTION_SUMMARY_LOAD_ERROR', () => {
    expect(reducer({}, {
      type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR
    })).toEqual({})
  })
})