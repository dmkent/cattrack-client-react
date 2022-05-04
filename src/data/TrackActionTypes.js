const ActionTypes = {
  CLEAR_ERROR: "CLEAR_ERROR",

  AUTH_RESPONSE_RECEIVED: "auth/response",
  AUTH_ERROR: "auth/failure",
  AUTH_REQUEST: "auth/request",
  AUTH_LOGOUT: "auth/logout",

  SELECT_TRANSACTION_PAGE: "SELECT_TRANSACTION_PAGE",

  TRANSACTION_PAGE_LOADED: "transactions/loaded",
  TRANSACTION_PAGE_LOAD_ERROR: "transaction/load-error",
  TRANSACTION_SUMMARY_LOADED: "transaction/summary-loaded",
  TRANSACTION_SUMMARY_LOAD_ERROR: "transaction/summary-load-error",
  TRANSACTION_UPDATED: "transaction/updated",
  TRANSACTION_UPDATE_ERROR: "transaction/update-error",
  TRANSACTION_SPLIT_ERROR: "transaction/split-error",
  TRANSACTION_SPLIT_SUCCESS: "transaction/split-success",

  ACCOUNTS_LOADED: "accounts/loaded",
  ACCOUNTS_LOAD_ERROR: "accounts/load-error",
  ACCOUNT_SELECTED: "accounts/selected",
  ACCOUNT_UPLOAD_SUCESS: "accounts/upload-started",
  ACCOUNT_UPLOAD_STARTED: "accounts/upload-success",
  ACCOUNT_UPLOAD_PROGRESS_UPDATE: "accounts/upload-progress-update",
  ACCOUNT_UPLOAD_ERROR: "accounts/upload-failed",
  ACCOUNT_CREATE_SUCCESS: "accounts/created",
  ACCOUNT_CREATE_ERROR: "accounts/create-error",
  ACCOUNT_BALANCE_SERIES_LOADED: "account/balance-series-loaded",
  ACCOUNT_BALANCE_SERIES_LOAD_ERROR: "account/balance-series-load-error",

  PERIODS_LOADED: "periods/loaded",
  PERIODS_LOAD_ERROR: "periods/load-error",

  CATEGORY_SERIES_LOADED: "category/series-loaded",
  CATEGORY_SERIES_LOAD_ERROR: "category/series-load-error",

  CATEGORISOR_SET_TRANSACTION: "categorisor/set-transaction",
  CATEGORISOR_SUGGESTIONS_RECEIVED: "categorisor/suggestions-received",
  CATEGORISOR_SUGGESTIONS_ERROR: "categorisor/suggestions-error",
  CATEGORISOR_CATEGORIES_RECEIVED: "categorisor/categories-received",
  CATEGORISOR_CATEGORIES_ERROR: "categorisor/categories-error",
  CATEGORISOR_ADD_SPLIT: "categorisor/add-split",
  CATEGORISOR_REMOVE_SPLIT: "categorisor/remove-split",
  CATEGORISOR_SET_SPLIT: "categorisor/set-split",
  CATEGORISOR_SHOW: "categorisor/show",
  CATEGORISOR_HIDE: "categorisor/hide",

  PAYMENT_SERIES_RECEIVED: "payment-series/received",
  PAYMENT_SERIES_ERROR: "payment-series/error",
  PAYMENT_SERIES_SELECT: "payment-series/select",
  PAYMENT_SERIES_ADD_BILL_SUCCESS: "payment-series/add-bill-success",
  PAYMENT_SERIES_ADD_BILL_ERROR: "payment-series/add-bill-error",
};

export default ActionTypes;
