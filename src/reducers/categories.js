import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';

function getInitialState() {
  return {
    show_categorisor: false,
    transaction: null,
    suggestions: Immutable.List(),
    categories: Immutable.List(),
    splits: Immutable.List(),
    is_valid: {
      valid: null,
      message: "",
    },
  }
}

function initialSplits(transaction, suggestions) {
  let category = transaction.category;
  if (category === null) {
    if (suggestions.size > 0) {
      category = suggestions.get(0).id;
    } else {
      category = "";
    }
  }
  return Immutable.List([
    {
      category: "" + category,
      amount: transaction.amount,
    }
  ]);
}

function splitsAreValid(transaction, splits) {
  let total = 0;
  let cats = [];
  let ncats = 0;
  splits.forEach(function(split) {
    // ignore empty splits
    if (split.amount == "") {
      return;
    }

    // Add amounts to total
    total = total + parseFloat(split.amount);

    // Get category to check is unique
    if (cats.indexOf(split.category) < 0) {
      cats.push(split.category);
    }

    ncats++;

  }, this);

  const delta = Math.abs(total - parseFloat(transaction.amount));
  if (delta > 0.005) {
    return {
      message: "Split amount must sum to transaction amount.",
      valid: false,
    };
  }

  if (cats.length < ncats) {
    return {
      message: "All selected categories must be different.",
      valid: false
    };
  }

  return {
    message: "",
    valid: true,
  }
}

const categories = (state = null, action) => {
  if (state ===  null) {
    state = getInitialState();
  }
  let new_state = null;
  switch (action.type) {
    case TrackActionTypes.CATEGORISOR_SET_TRANSACTION:
      return Object.assign({}, state, {
        transaction: action.transaction,
        splits: initialSplits(action.transaction, state.suggestions),
        is_valid: {
          valid: true,
        }
      });
    case TrackActionTypes.CATEGORISOR_ADD_SPLIT:
      return Object.assign({}, state, {
        splits: state.splits.push({
          category: state.categories.get(0, {id: 0}).id,
          amount: "0"
        }),
        is_valid: {
          valid: null,
        }
      });
    case TrackActionTypes.CATEGORISOR_SET_SPLIT:
      const new_split = Object.assign({}, state.splits.get(action.idx), {
        [action.name]: action.value,
      });
      new_state = Object.assign({}, state, {
        splits: state.splits.set(action.idx, new_split),
      });
      new_state.is_valid = splitsAreValid(new_state.transaction, new_state.splits);
      return new_state;    
    case TrackActionTypes.CATEGORISOR_REMOVE_SPLIT:
      new_state = Object.assign({}, state, {
        splits: state.splits.delete(action.idx),
      });
      new_state.is_valid = splitsAreValid(new_state.transaction, new_state.splits);      
      return new_state;
    case TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED:
      return Object.assign({}, state, {
        categories: Immutable.List(action.categories),
      });
    case TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR:
      return state;
    case TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED:
      const new_suggestions = Immutable.List(action.categories);
      return Object.assign({}, state, {
        suggestions: new_suggestions,
        splits: initialSplits(state.transaction, new_suggestions),
      });
    case TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR:
      return state;
    case TrackActionTypes.CATEGORISOR_SHOW:
      return Object.assign({}, state, {
        show_categorisor: true,
      });
    case TrackActionTypes.CATEGORISOR_HIDE:
      return Object.assign({}, state, {
        show_categorisor: false,
      });
    default:
      return state;
  }
}

export default categories;