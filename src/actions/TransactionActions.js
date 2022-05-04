import TrackActionTypes from "../data/TrackActionTypes";
import {
  fetch_from_api,
  checkStatus,
  filters_to_params,
} from "../client/CatTrackAPI";
import Transaction from "../data/Transaction";

const TransactionActions = {
  selectTransactions(page_num, page_size, filters) {
    const params = filters_to_params({
      page: page_num,
      page_size: page_size,
      ...filters,
    });
    return (dispatch) => {
      return fetch_from_api(dispatch, "/api/transactions/" + params)
        .then(checkStatus)
        .then((rawTransactions) => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_PAGE_LOADED,
            page_num: page_num,
            page_size: page_size,
            transactions: rawTransactions.results.map((rawTransaction) => {
              return new Transaction(rawTransaction);
            }),
            num_records: rawTransactions.count,
            filters: filters,
          });
        })
        .catch((error) => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_PAGE_LOAD_ERROR,
            page_num,
            error,
          });
        });
    };
  },
  updateTransactionFilter(new_filters) {
    return (dispatch, getState) => {
      const state = getState().transactions;
      const merged = Object.assign({}, state.filters, new_filters);

      return new Promise((resolve) => {
        dispatch(this.selectTransactions(1, state.page_size, merged)).then(
          () => {
            dispatch(this.loadTransactionSummary(merged)).then(() => {
              resolve();
            });
          }
        );
      });
    };
  },
  loadTransactionSummary(filters) {
    const query_params = filters_to_params(filters);
    return (dispatch) => {
      return fetch_from_api(
        dispatch,
        "/api/transactions/summary/" + query_params
      )
        .then(checkStatus)
        .then((rawSummary) => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED,
            summary: rawSummary,
            filters: filters,
          });
        })
        .catch((error) => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR,
            error,
          });
        });
    };
  },
};

export default TransactionActions;
