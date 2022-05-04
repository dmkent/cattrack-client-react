import TrackActionTypes from "../data/TrackActionTypes";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";
import { parseErrors } from "../client/ErrorParser";

const PaymentSeriesActions = {
  loadPaymentSeries() {
    return (dispatch) => {
      return fetch_from_api(dispatch, "/api/payments/")
        .then(checkStatus)
        .then((raw_series) => {
          dispatch({
            type: TrackActionTypes.PAYMENT_SERIES_RECEIVED,
            series: raw_series,
          });
        })
        .catch((error) => {
          dispatch({
            type: TrackActionTypes.PAYMENT_SERIES_ERROR,
            error,
          });
        });
    };
  },

  selectPaymentSeries(idx) {
    return {
      type: TrackActionTypes.PAYMENT_SERIES_SELECT,
      series: idx,
    };
  },

  paymentSeriesAddBillFromFile(idx, upload_file) {
    let data = new FormData();
    data.append("data_file", upload_file);
    data.append("name", idx);

    return (dispatch) => {
      return fetch_from_api(dispatch, "/api/payments/" + idx + "/loadpdf/", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": undefined,
        },
      })
        .then((resp) => {
          if (resp.status == 200) {
            dispatch(this.loadPaymentSeries());
            dispatch({
              type: TrackActionTypes.PAYMENT_SERIES_ADD_BILL_SUCCESS,
              series: idx,
            });
            // All done. Resolve to null.
            return Promise.resolve(null);
          }
          // Non-200 status, parse the content
          return resp.json();
        })
        .catch(() => {
          // Parse of JSON failed.
          dispatch({
            type: TrackActionTypes.PAYMENT_SERIES_ADD_BILL_ERROR,
            series: idx,
            error: new Error("Unable to upload."),
          });
        })
        .then((data) => {
          let message = "";
          if (data === null) {
            return;
          } else if (data instanceof Object) {
            message = parseErrors(data);
          } else {
            message = data;
          }
          dispatch({
            type: TrackActionTypes.PAYMENT_SERIES_ADD_BILL_ERROR,
            series: idx,
            error: new Error(message),
          });
        });
    };
  },
};

export default PaymentSeriesActions;
