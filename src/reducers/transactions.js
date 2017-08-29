import Immutable from 'immutable';

import Counter from '../data/Counter';
import TrackActionTypes from '../data/TrackActionTypes';
import Transaction from '../data/Transaction';

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
    transactions: Immutable.OrderedMap(),
    filters: resetFilter(),
    summary: Immutable.OrderedMap(),
  }
}

const transactions = (state = null, action) => {
  if (state ===  null) {
    state = getInitialState();
  }

  switch (action.type) {
    case TrackActionTypes.ADD_TRANSACTION:
      const id = Counter.increment();
      return Object.assign({}, state, {
          transactions: state.transactions.set(id, new Transaction({
            id,
            when: action.when,
            description: action.description,
            amount: action.amount,
          })
        )
      });
    case 'transaction/updated':
      return Object.assign({}, state, {
        transactions: state.transactions.set(action.transaction.id, action.transaction),
      });
    case TrackActionTypes.TRANSACTION_PAGE_LOADED:
      const num_pages = Math.ceil(action.num_records / state.page_size);
      return Object.assign({}, state, {
        active_page: action.page_num,
        num_pages: num_pages,
        transactions: Immutable.OrderedMap(action.transactions.map(transaction => [
          transaction.id,
          transaction,
        ])),
        filters: action.filters,
      });
   case 'transactions/summary-loaded':
      return Object.assign({}, state, {
        summary: Immutable.OrderedMap(action.summary.map(item => [
          item.category,
          item,
        ])),
        filters: action.filters,
      });
    default:
      return state;
  }
}

export default transactions;