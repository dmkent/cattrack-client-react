import { OrderedMap } from "immutable";

import TrackActionTypes from "../data/TrackActionTypes";

function errors(state = null, action) {
  if (state === null || state === undefined) {
    return {
      errors: new OrderedMap(),
      next_error: 0,
    };
  }

  let title = "";
  switch (action.type) {
    case TrackActionTypes.CLEAR_ERROR:
      return Object.assign({}, state, {
        errors: state.errors.delete(action.error_number),
      });
    case TrackActionTypes.AUTH_ERROR:
      title += "Error performing login: ";
      break;
    case TrackActionTypes.TRANSACTION_PAGE_LOAD_ERROR:
      title += "Error loading transactions: ";
      break;
    case TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR:
      title += "Error loading transaction summary: ";
      break;
    case TrackActionTypes.TRANSACTION_UPDATE_ERROR:
      title += "Error updating transaction: ";
      break;
    case TrackActionTypes.TRANSACTION_SPLIT_ERROR:
      title += "Error splitting transaction: ";
      break;
    case TrackActionTypes.ACCOUNTS_LOAD_ERROR:
      title += "Error loading accounts: ";
      break;
    case TrackActionTypes.ACCOUNT_CREATE_ERROR:
      title += "Error creating account: ";
      break;
    case TrackActionTypes.ACCOUNTS_UPLOAD_ERROR:
      title += "Error uploading to account: ";
      break;
    case TrackActionTypes.PERIODS_LOAD_ERROR:
      title += "Error loading period filters: ";
      break;
    case TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR:
      title += "Error fetching category suggestions: ";
      break;
    case TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR:
      title += "Error loading categories: ";
      break;
    case TrackActionTypes.CATEGORY_SERIES_LOAD_ERROR:
      title += "Error loading transaction series: ";
      break;
    default:
      return state;
  }
  let err_messages = action.error.message;
  if (!(err_messages instanceof Array)) {
    err_messages = [err_messages];
  }
  return {
    errors: state.errors.set(state.next_error, {
      title: title,
      messages: err_messages,
    }),
    next_error: state.next_error + 1,
  };
}

export default errors;
