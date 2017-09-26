import Immutable from 'immutable'
import reducer from '../errors'
import TrackActionTypes from '../../data/TrackActionTypes'

describe('errors reducer', () => {
  
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        next_error: 0,
        errors: Immutable.OrderedMap(),
      }
    )
  })

  it('should handle CLEAR_ERROR', () => {
    expect(
      reducer({
        next_error: 2,
        errors: Immutable.OrderedMap({
          0: {title: "Error 1", messages: "This is an error"},
          1: {title: "Error 2", messages: "And another one"}
        })
      }, {
        type: TrackActionTypes.CLEAR_ERROR,
        error_number: "1"
      })
    ).toEqual({
      next_error: 2,
      errors: Immutable.OrderedMap({
        0: {title: "Error 1", messages: "This is an error"},
      })
    })
  })

  it('should add errors and increment the next counter', () => {
    const init_state = reducer(null, {});
    expect(
      reducer(init_state, {
        type: TrackActionTypes.ACCOUNTS_LOAD_ERROR,
        error: {
          message: "Error on account load."
        }
      })
    ).toEqual({
      next_error: 1,
      errors: Immutable.OrderedMap().set(
        0,
        {title: "Error loading accounts: ", messages: "Error on account load."}
      )
    })
  })

  it('should add to existing errors and increment the next counter', () => {
    expect(
      reducer({
        next_error: 1,
        errors: Immutable.OrderedMap().set(
          0,
          {title: "Error loading accounts: ", messages: "Error on account load."}
        )
      }, {
        type: TrackActionTypes.ACCOUNTS_UPLOAD_ERROR,
        error: {
          message: "Error on account upload."
        }
      })
    ).toEqual({
      next_error: 2,
      errors: Immutable.OrderedMap([
        [0, {title: "Error loading accounts: ", messages: "Error on account load."}],
        [1, {title: "Error uploading to account: ", messages: "Error on account upload."}],
      ])
    })
  })

  it('should add errors on auth error', () => {
    const init_state = reducer(null, {});
    const expected = {
      next_error: 1,
      errors: Immutable.OrderedMap([
        [0, {title: "Error performing login: ", messages: "Error logging in."}]
      ])
    };
    const result = reducer(init_state, {
      type: TrackActionTypes.AUTH_ERROR,
      error: {
        message: "Error logging in."
      }
    });
    expect(result.next_error).toBe(expected.next_error);
    expect(result.errors).toEqualImmutable(expected.errors);
  })

  it('should add errors on period load error', () => {
    const init_state = reducer(null, {});
    const expected = {
      next_error: 1,
      errors: Immutable.OrderedMap([
        [0, {title: "Error loading period filters: ", messages: "Periods error."}]
      ])
    };
    const result = reducer(init_state, {
      type: TrackActionTypes.PERIODS_LOAD_ERROR,
      error: {
        message: "Periods error."
      }
    });
    expect(result.next_error).toBe(expected.next_error);
    expect(result.errors).toEqualImmutable(expected.errors);
  })

  it('should add categorisor errors', () => {
    const init_state = reducer(null, {});
    const expected = {
      next_error: 2,
      errors: Immutable.OrderedMap([
        [0, {title: "Error loading categories: ", messages: "Cats error."}],
        [1, {title: "Error fetching category suggestions: ", messages: "Suggestion error."}]
      ])
    };
    const result1 = reducer(init_state, {
      type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR,
      error: {
        message: "Cats error."
      }
    });
    const result2 = reducer(result1, {
      type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR,
      error: {
        message: "Suggestion error."
      }
    });
    expect(result2.next_error).toBe(expected.next_error);
    expect(result2.errors).toEqualImmutable(expected.errors);
  })

  it('should handle transaction errors', () => {
    const init_state = reducer(null, {});
    const expected = {
      next_error: 5,
      errors: Immutable.OrderedMap([
        [0, {title: "Error loading transactions: ", messages: "Page error."}],
        [1, {title: "Error loading transaction summary: ", messages: "Summary error."}],
        [2, {title: "Error splitting transaction: ", messages: "Split error."}],
        [3, {title: "Error updating transaction: ", messages: "Add error."}],
        [4, {title: "Error creating account: ", messages: "Account create error."}],
      ])
    };
    const result1 = reducer(init_state, {
      type: TrackActionTypes.TRANSACTION_PAGE_LOAD_ERROR,
      error: {
        message: "Page error."
      }
    });
    const result2 = reducer(result1, {
      type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR,
      error: {
        message: "Summary error."
      }
    });
    const result3 = reducer(result2, {
      type: TrackActionTypes.TRANSACTION_SPLIT_ERROR,
      error: {
        message: "Split error."
      }
    });
    const result4 = reducer(result3, {
      type: TrackActionTypes.TRANSACTION_UPDATE_ERROR,
      error: {
        message: "Add error."
      }
    });
    const result5 = reducer(result4, {
      type: TrackActionTypes.ACCOUNT_CREATE_ERROR,
      error: {
        message: "Account create error."
      }
    });
    // should ignore...
    const result6 = reducer(result5, {
      type: TrackActionTypes.AUTH_REQUEST,
    });
    expect(result6.next_error).toBe(expected.next_error);
    expect(result6.errors).toEqualImmutable(expected.errors);
  })
})