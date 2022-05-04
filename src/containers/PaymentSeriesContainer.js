import { connect } from "react-redux";
import TrackActions from "../actions/TrackActions";
import PaymentSeriesView from "../views/PaymentSeriesView";

export function mapStateToProps(state) {
  return {
    ...state.bills,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadPaymentSeries: () => {
      dispatch(TrackActions.loadPaymentSeries());
    },
    selectPaymentSeries: (idx) => {
      dispatch(TrackActions.selectPaymentSeries(idx));
    },
    paymentSeriesAddBillFromFile: (idx, data) => {
      dispatch(TrackActions.paymentSeriesAddBillFromFile(idx, data));
    },
  };
}

const PaymentSeriesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentSeriesView);

export default PaymentSeriesContainer;
