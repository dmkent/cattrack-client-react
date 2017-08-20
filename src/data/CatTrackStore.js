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
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case TrackActionTypes.ADD_TRANSACTION:
        const id = Counter.increment();
        return state.set(id, new Transaction({
          id,
          when: action.when,
          description: action.description,
          amount: action.amount,
        }));
      case TrackActionTypes.SELECT_TRANSACTION_PAGE:
        CatTrackDataManager.loadTransactions(action.page_num);
        return state;
      case TrackActionTypes.TRANSACTION_PAGE_LOADED:
        return state.merge(action.transactions.map(transaction => [
          transaction.id,
          transaction,
        ]));
      default:
        return state;
    }
  }
}

export default new CatTrackStore();