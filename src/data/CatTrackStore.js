import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';

import Counter from './Counter';
import Dispatcher from './TrackDispatcher';
import TrackActionTypes from './TrackActionTypes';
import Transaction from './Transaction';
import CatTrackDataManager from '../client/CatTrackDataManager';

class CatTrackStore extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return {
      active_page: 1,
      num_pages: 1,
      page_size: 20,
      transactions: Immutable.OrderedMap(),
    }
  }

  reduce(state, action) {
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
      case TrackActionTypes.SELECT_TRANSACTION_PAGE:
        CatTrackDataManager.loadTransactions(action.page_num, state.page_size);
        return state;
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
}

export default new CatTrackStore();