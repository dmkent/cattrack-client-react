import Immutable from 'immutable'
import reducer from '../categories'
import TrackActionTypes from '../../data/TrackActionTypes'

const initState = {
  categories: Immutable.List(),
  is_valid: {
    valid: null,
    message: ""
  },
  show_categorisor: false,
  splits: Immutable.List(),
  suggestions: Immutable.List(),
  transaction: null
}
  
describe('categories reducer', () => {
  
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initState)
  })

  it('should handle CATEGORISOR_SET_TRANSACTION', () => {
    expect(
      reducer(Object.assign({}, initState), {
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: {id: 1, category: 4, amount: -56}
      })
    ).toEqual(Object.assign({}, initState, {
      transaction: {id: 1, category: 4, amount: -56},
      splits: Immutable.List([{category: "4", amount: -56}]),
      is_valid: {
        valid: true,
      }
    }))

    // With null category
    expect(
      reducer(Object.assign({}, initState), {
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: {id: 1, category: null, amount: -56}
      })
    ).toEqual(Object.assign({}, initState, {
      transaction: {id: 1, category: null, amount: -56},
      splits: Immutable.List([{category: "", amount: -56}]),
      is_valid: {
        valid: true,
      }
    }))
  })

  it('should handle CATEGORISOR_ADD_SPLIT', () => {
    expect(
      reducer({
        categories: Immutable.List([{id: 1, name: "cat1"}]),
        is_valid: {
          valid: null,
          message: ""
        },
        show_categorisor: false,
        splits: Immutable.List([{category: 4, amount: "-45"}]),
        suggestions: Immutable.List(),
        transaction: null
      }, {
        type: TrackActionTypes.CATEGORISOR_ADD_SPLIT,
      })
    ).toEqual({
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: null,
      },
      show_categorisor: false,
      splits: Immutable.List([
        {category: 4, amount: "-45"}, 
        {category: 1, amount: "0"}
      ]),
      suggestions: Immutable.List(),
      transaction: null
    })
  })

  it('should handle CATEGORISOR_SET_SPLIT', () => {
    // Initial state - two splits, valid.
    const state1 = {
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([
        {category: 4, amount: "-45"},
        {category: 1, amount: "0"},
      ]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    };

    // Intermediate state after set new amount on second split.
    // Invalid as amounts do not sum to transaction ammount.
    const state2 = {
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: false,
        message: "Split amount must sum to transaction amount."
      },
      show_categorisor: false,
      splits: Immutable.List([
        {category: 4, amount: "-45"}, 
        {category: 1, amount: "-32"}
      ]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    }

    /* Final state, after setting second amount. Valid as now sum to 
       transaction amount.*/
    const state3 = {
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: true,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([
        {category: 4, amount: "-13"}, 
        {category: 1, amount: "-32"}
      ]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_SET_SPLIT,
      idx: 1,
      name: "amount",
      value: "-32"
    }))
    .toEqual(state2)
    expect(reducer(state2, {
      type: TrackActionTypes.CATEGORISOR_SET_SPLIT,
      idx: 0,
      name: "amount",
      value: "-13"
    }))
    .toEqual(state3)
  })

  it('should handle CATEGORISOR_REMOVE_SPLIT', () => {
    // Initial state - two splits, valid.
    const state1 = {
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([
        {category: 4, amount: "-45"},
        {category: 1, amount: "0"},
      ]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45"}
    };

    // Final state after removing split.
    const state2 = {
      categories: Immutable.List([{id: 1, name: "cat1"}]),
      is_valid: {
        valid: true,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: 4, amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45"}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_REMOVE_SPLIT,
      idx: 1,
    }))
    .toEqual(state2)
  })

  it('should handle CATEGORISOR_CATEGORIES_RECEIVED', () => {
    // Initial state - no categories
    const state1 = {
      categories: Immutable.List(),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: 4, amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    };

    // Final state after add categories.
    const state2 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: 4, amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED,
      categories: [
        {id: 1, name: "cat1"},
        {id: 3, name: "cat2"}
      ],
    }))
    .toEqual(state2)
  })

  it('should handle CATEGORISOR_SUGGESTIONS_RECEIVED', () => {
    // Initial state - no suggestions
    const state1 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "3", amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: "3"}
    };

    // Final state after add suggestins, splits unchanged.
    const state2 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "3", amount: "-45"}]),
      suggestions: Immutable.List([
        {id: 4, name: "cat2"},
        {id: 3, name: "cat5"}
      ]),
      transaction: {id: 2, amount: "-45", category: "3"}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED,
      categories: [
        {id: 4, name: "cat2"},
        {id: 3, name: "cat5"}
      ],
    }))
    .toEqual(state2)
  })

  it('should handle CATEGORISOR_SUGGESTIONS_RECEIVED when no current category', () => {
    // Initial state - no suggestions
    const state1 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "3", amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    };

    // Final state after add suggestions, split updated to match suggested.
    const state2 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "4", amount: "-45"}]),
      suggestions: Immutable.List([{id: 4, name: "cat2"}]),
      transaction: {id: 2, amount: "-45", category: null}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED,
      categories: [{id: 4, name: "cat2"}],
    }))
    .toEqual(state2)
  })

  it('should handle CATEGORISOR_SUGGESTIONS_RECEIVED when no current category multiple suggestions', () => {
    // Initial state - no suggestions
    const state1 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "3", amount: "-45"}]),
      suggestions: Immutable.List(),
      transaction: {id: 2, amount: "-45", category: null}
    };

    // Final state after add suggestions, split updated to match suggested.
    const state2 = {
      categories: Immutable.List([
        {id: 1, name: "cat1"},
        {id: 3, name: "cat5"},
        {id: 4, name: "cat2"}
      ]),
      is_valid: {
        valid: null,
        message: ""
      },
      show_categorisor: false,
      splits: Immutable.List([{category: "4", amount: "-45"}]),
      suggestions: Immutable.List([
        {id: 4, name: "cat2"},
        {id: 3, name: "cat5"}
      ]),
      transaction: {id: 2, amount: "-45", category: null}
    }

    expect(reducer(state1, {
      type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED,
      categories: [
        {id: 4, name: "cat2"},
        {id: 3, name: "cat5"}
      ],
    }))
    .toEqual(state2)
  })

  it('should handle CATEGORISOR_SHOW', () => {
    expect(reducer({show_categorisor: false}, {
      type: TrackActionTypes.CATEGORISOR_SHOW
    }).show_categorisor).toBeTruthy()
  })

  it('should handle CATEGORISOR_HIDE', () => {
    expect(reducer({show_categorisor: true}, {
      type: TrackActionTypes.CATEGORISOR_HIDE
    }).show_categorisor).toBeFalsy()
  })

  it('should handle CATEGORISOR_CATEGORIES_ERROR', () => {
    expect(reducer({}, {
      type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR
    })).toEqual({})
  })

  it('should handle CATEGORISOR_SUGGESTIONS_ERROR', () => {
    expect(reducer({}, {
      type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR
    })).toEqual({})
  })
})