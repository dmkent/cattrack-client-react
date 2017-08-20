import TrackActionTypes from './TrackActionTypes';
import TrackDispatcher from './TrackDispatcher';

const Actions = {
  addTransaction(when, description, amount) {
    TrackDispatcher.dispatch({
      type: TrackActionTypes.ADD_TRANSACTION,
      when,
      description,
      amount
    });
  },
  selectTransactionPage(page_num) {
    TrackDispatcher.dispatch({
      type: TrackActionTypes.SELECT_TRANSACTION_PAGE,
       page_num,
    });
  }
};

export default Actions;