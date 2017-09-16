import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';

function resetFilter() {
  return {
    account: null,
    from_date: null,
    to_date: null,
    category: null,
  };
}

function getInitialState() {
  return {
    active_page: 1,
    num_pages: 1,
    page_size: 20,
    transactions: new Immutable.OrderedMap(),
    filters: resetFilter(),
    summary: new Immutable.OrderedMap(),
  }
}

function transactions(state = null, action) {
  if (state === null) {
    state = getInitialState();
  }

  let num_pages = state.num_pages;
  switch (action.type) {
    case TrackActionTypes.TRANSACTION_UPDATED:
      return Object.assign({}, state, {
        transactions: state.transactions.set(action.transaction.id, action.transaction),
      });
    case TrackActionTypes.TRANSACTION_PAGE_LOADED:
      num_pages = Math.ceil(action.num_records / state.page_size);
      return Object.assign({}, state, {
        active_page: action.page_num,
        num_pages: num_pages,
        transactions: new Immutable.OrderedMap(action.transactions.map(transaction => [
          transaction.id,
          transaction,
        ])),
        filters: action.filters,
      });
   case TrackActionTypes.TRANSACTION_SUMMARY_LOADED:
      return Object.assign({}, state, {
        summary: new Immutable.OrderedMap(action.summary.map(item => [
          item.category,
          item,
        ])),
        filters: action.filters,
      });
    case TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR:
      return state;
    default:
      return state;
  }
}

export default transactions;