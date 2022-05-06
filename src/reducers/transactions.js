import Immutable from "immutable";

import TrackActionTypes from "../data/TrackActionTypes";

function resetFilter() {
  return {
    account: null,
    from_date: null,
    to_date: null,
    category: null,
    has_category: null,
  };
}

function getInitialState() {
  return {
    filters: resetFilter(),
    summary: Immutable.OrderedMap(),
  };
}

function transactions(state = null, action) {
  if (state === null) {
    state = getInitialState();
  }

  switch (action.type) {
    case TrackActionTypes.TRANSACTION_SUMMARY_LOADED:
      return Object.assign({}, state, {
        summary: Immutable.OrderedMap(
          action.summary.map((item) => [item.category, item])
        ),
        filters: action.filters,
      });
    case TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR:
      return state;
    default:
      return state;
  }
}

export default transactions;
