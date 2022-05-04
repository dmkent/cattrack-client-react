import TrackActionTypes from "../data/TrackActionTypes";

import AccountActions from "./AccountActions";
import CategorisorActions from "./CategorisorActions";
import CategoryActions from "./CategoryActions";
import PeriodActions from "./PeriodActions";
import TransactionActions from "./TransactionActions";
import PaymentSeriesActions from "./PaymentSeriesActions";

const TrackActions = {
  ...AccountActions,
  ...CategorisorActions,
  ...CategoryActions,
  ...PeriodActions,
  ...TransactionActions,
  ...PaymentSeriesActions,

  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
  },
};

export default TrackActions;
