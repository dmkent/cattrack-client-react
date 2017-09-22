import TrackActionTypes from '../data/TrackActionTypes';

import AccountActions from './AccountActions'
import AuthActions from './AuthActions'
import CategorisorActions from './CategorisorActions'
import CategoryActions from './CategoryActions'
import PeriodActions from './PeriodActions'
import TransactionActions from './TransactionActions'

const TrackActions = {
  ...AccountActions,
  ...AuthActions,
  ...CategorisorActions,
  ...CategoryActions,
  ...PeriodActions,
  ...TransactionActions,

  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    }
  },
};

export default TrackActions;