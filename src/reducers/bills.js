import Immutable from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';
import {series_from_json} from '../data/PaymentSeries'

function payment_series(state = null, action) {
  if (state === null) {
    state = {
      payment_series: Immutable.Map(),
      current_series: 0
    }
  }

  switch (action.type) {
    case TrackActionTypes.PAYMENT_SERIES_RECEIVED:
      return Object.assign({}, state, {
        payment_series: state.payment_series.merge(action.series.map(
          series => [series.id, series_from_json(series)]
        )),
      });
    case TrackActionTypes.PAYMENT_SERIES_SELECT:
      return Object.assign({}, state, {
        current_series: action.series,
      })
    default:
      return state;
  }
}

export default payment_series;