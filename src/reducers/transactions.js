import Immutable from 'immutable';

import Counter from '../data/Counter';
import TrackActionTypes from '../data/TrackActionTypes';
import Transaction from '../data/Transaction';

function getInitialState() {
  return {
    active_page: 1,
    num_pages: 1,
    page_size: 20,
    transactions: Immutable.OrderedMap(),
  }
}

const transactions = (state = null, action) => {
  if (state ===  null) {
    state = getInitialState();
  }
  console.log(action);
  switch (action.type) {
    case TrackActionTypes.ADD_TRANSACTION:
      const id = Counter.increment();
      return {
        active_page: 1,
        num_pages: 1,
        page_size: state.page_size,
        transactions: state.transactions.set(id, new Transaction({
          id,
          when: action.when,
          description: action.description,
          amount: action.amount,
        }))
      };
    case TrackActionTypes.TRANSACTION_PAGE_LOADED:
      const num_pages = Math.ceil(action.num_records / state.page_size);
      return {
        active_page: action.page_num,
        num_pages: num_pages,
        page_size: state.page_size,
        transactions: Immutable.OrderedMap(action.transactions.map(transaction => [
          transaction.id,
          transaction,
        ])),
      };
    default:
      return state;
  }
}

export default transactions;