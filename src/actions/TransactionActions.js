import TrackActionTypes from "../data/TrackActionTypes";
import {
  fetch_from_api,
  checkStatus,
  filters_to_params,
} from "../client/CatTrackAPI";

const TransactionActions = {
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
