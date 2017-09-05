import {OrderedMap} from 'immutable';

import TrackActionTypes from '../data/TrackActionTypes';

const errors = (state = null, action) => {
  if (state === null) {
    return {
      errors: OrderedMap(),
      next_error: 0,
    }
  }

  let title = "";
  let is_error = false;
  switch (action.type) {
    case TrackActionTypes.CLEAR_ERROR:
      return Object.assign({}, state, {
        errors: state.errors.delete(action.error_number),
      });
    case TrackActionTypes.AUTH_ERROR:
      title += "Error performing login: ";
      is_error = true;
      break;
    case TrackActionTypes.TRANSACTION_PAGE_LOAD_ERROR:
      title += "Error loading transactions: ";
      is_error = true;
      break;
    case TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR:
      title += "Error loading transaction summary: ";
      is_error = true;
      break;
    case TrackActionTypes.TRANSACTION_UPDATE_ERROR:
      title += "Error updating transaction: ";
      is_error = true;
      break;
    case TrackActionTypes.TRANSACTION_SPLIT_ERROR:
      title += "Error splitting transaction: ";
      is_error = true;
      break;
    case TrackActionTypes.ACCOUNTS_LOAD_ERROR:
      title += "Error loading accounts: ";
      is_error = true;
      break;
    case TrackActionTypes.PERIODS_LOAD_ERROR:
      title += "Error loading period filters: ";
      is_error = true;
      break;
    case TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR:
      title += "Error fetching category suggestions: ";
      is_error = true;
      break;
    case TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR:
      title += "Error loading categories: ";
      is_error = true;
      break;
    default:
      return state;
  }
 
  if (is_error) {
      return {
        errors: state.errors.set(state.next_error, {
          title: title,
          messages: action.error.message,
        }),
        next_error: state.next_error + 1,
      };
  }
}


export default errors;