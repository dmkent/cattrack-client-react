import TrackActionTypes from '../data/TrackActionTypes';

import CatTrackAPI, {parseErrors} from '../client/CatTrackAPI';

import fetch from 'isomorphic-fetch';
import * as Cookies from "js-cookie"

import Transaction from '../data/Transaction';
import Account from '../data/Account';
import Category from '../data/Category';
import Period from '../data/Period';

let API_URI = "http://localhost:8000"
if (process.env.NODE_ENV === 'production') {
  API_URI = '/be';
}

function refreshLogin(dispatch, getState) {
  const auth = getState().auth;
  if (!auth.is_logged_in) {
    dispatch({
      type: TrackActionTypes.AUTH_ERROR,
      error: {
        message: "Not logged in."
      }
    })
    return Promise.reject(new Error("Not logged in."));
  }
  let now = new Date();
  // 1. check if we are expired - clear auth
  if (now > auth.expires) {
      console.log("Auth expired. Expiry: " + auth);
      dispatch(TrackActions.logout());
      return Promise.reject("Auth has expired.");
  }

  // 2. check if more than 5 mins until expire - don't refresh
  if ((auth.expires.getTime() - now.getTime()) > 300000 ) {
      // Hasn't expired and won't in next five minutes so bail.
      return Promise.resolve(null);
  }

  // 3. not expired, but near expiry - refresh
  return fetch(API_URI + '/api-token-refresh/', {
    method: 'POST',
    body: JSON.stringify({token: auth.token}),
    headers: {'Content-Type': 'application/json'},
  })
  .then(checkStatus)
  .then(resp => {
    localStorage.setItem('jwt', resp.token);
    dispatch({
      type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
      token: resp.token,
    });
    return Promise.resolve();
  })
  .catch(error => {
    dispatch({
      type: TrackActionTypes.AUTH_ERROR,
      error
    });
    return Promise.reject(new Error("Auth failed."));
  });
}

function fetch_from_api(dispatch, getState, uri, options = {}) {
  return refreshLogin(dispatch, getState)
  .then(() => {
    // Set up authentication and security headers.
    let headers = Object.assign({
      'Content-Type': 'application/json',
    }, options.headers);
    const token = getState().auth.token;
    if (token !== undefined) {
      headers.Authorization = 'JWT ' + token;
    }
    const csrf_token = Cookies.get("csrftoken");
    if (csrf_token !== null) {
      headers['X-CSRFToken'] = csrf_token;
    }
    options.headers = headers;
    return fetch(API_URI + uri, {
      ...options,
    })
  })
  .catch(err => {console.log(err)})
}

function filters_to_params(filters) {
  let query_params = Object.entries(filters).map(([key, val]) => {
    if (val !== null) {
      return `${key}=${val}`;
    }
    return '';
  }).join('&');
  if (query_params.length > 0) {
    query_params = '?' + query_params;
  }
  return query_params;
}

function checkStatus(resp) {
  if (resp === undefined) {
    return Promise.reject(new Error("No response received"));
  } else if (resp.status == 200) {
    return resp.json()
  }
  return Promise.resolve(resp.json())
  .catch(() => {
    return Promise.reject({
      code: resp.status,
      message: [["Unable to decode response as JSON."]]
    })
  })
  .then((error) => {
    return Promise.reject({
      code: resp.status,
      message: parseErrors(error),
    });
  })

}

const TrackActions = {
  clearError(idx) {
    return {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    }
  },
  selectTransactions(page_num, page_size, filters) {
    const params = filters_to_params({
      page: page_num,
      page_size: page_size,
      ...filters
    })
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/transactions/' + params)
        .then(checkStatus)
        .then(rawTransactions => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_PAGE_LOADED,
            page_num: page_num,
            page_size: page_size,
            transactions: rawTransactions.results.map(rawTransaction => {
                return new Transaction(rawTransaction);
            }),
            num_records: rawTransactions.count,
            filters: filters,
          });
        })
        .catch(error => {
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
      
      return new Promise(resolve => {
        dispatch(this.selectTransactions(1, state.page_size, merged)).then(() => {
          dispatch(this.loadTransactionSummary(merged)).then( () => {
            resolve()
          })
        });
      });
    }
  },
  loadTransactionSummary(filters) {
    const query_params = filters_to_params(filters);
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/transactions/summary/' + query_params)
        .then(checkStatus)
        .then(rawSummary => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_SUMMARY_LOADED,
            summary: rawSummary,
            filters: filters,
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_SUMMARY_LOAD_ERROR,
            error,
          });
        });
    };
  },
  loadPeriods() {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/periods/')
        .then(checkStatus)
        .then(rawPeriods => {
          dispatch({
            type: TrackActionTypes.PERIODS_LOADED,
            periods: rawPeriods.map(rawPeriod => {
                return new Period(rawPeriod);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.PERIODS_LOAD_ERROR,
            error,
          });
        });
    };
  },
  loadAccounts() {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/accounts/')
        .then(checkStatus)
        .then(rawAccounts => {
          dispatch({
            type: TrackActionTypes.ACCOUNTS_LOADED,
            accounts: rawAccounts.map(rawAccount => {
                return new Account(rawAccount);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.ACCOUNTS_LOAD_ERROR,
            error,
          });
        });
    };
  },
  uploadToAccount(account, upload_file) {
    let data = new FormData();
    data.append('data_file', upload_file);
    data.append('name', account);
    
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/accounts/' + account + '/load/', {
        method: 'POST',
        body: data,
      }).then((resp) => {
        if (resp.status == 200) {
          dispatch({
            type: TrackActionTypes.ACCOUNT_UPLOAD_SUCESS,
            account,
          });
          // All done. Resolve to null.
          return Promise.resolve(null);
        }
        // Non-200 status, parse the content
        return resp.json();
      })
      .then((data) => {
          if (data === null) {
            return;
          }
          dispatch({
            type: TrackActionTypes.ACCOUNT_UPLOAD_ERROR,
            account,
            error: parseErrors(data),
          })
        });
    };
  },

  attemptLogin(username, password) {
    return (dispatch) => {
      return fetch(API_URI + '/api-token-auth/', {
          method: 'POST',
          body: JSON.stringify({username: username, password: password}),
          headers: {'Content-Type': 'application/json'}
        })
        .then(checkStatus)
        .then(resp => {
          localStorage.setItem('jwt', resp.token);
          dispatch({
            type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
            token: resp.token,
          })
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.AUTH_ERROR,
            error,
            username,
          });
        });
    };
  },
  restoreLogin() {
    const token = localStorage.getItem('jwt');
    return (dispatch) => {
      if (token !== undefined && token !== null) {
        dispatch({
          type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
          token: token,
        });
      }
      return Promise.resolve();
    }
  },
  logout() {
    localStorage.removeItem('jwt');
    return {
      type: TrackActionTypes.AUTH_LOGOUT,
    };
  },

  categorisorSetTransaction(transaction) {
    return (dispatch, getState) => {
      dispatch({
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: transaction,
      });

      return fetch_from_api(
        dispatch, getState, 
        '/api/transactions/' + transaction.id + '/suggest/')
        .then(checkStatus)
        .then(resp => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED,
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR,
            error,
          });
        });
    }
  },

  loadCategories() {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/categories/')
        .then(checkStatus)
        .then(resp => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED,
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR,
            error,
          });
        })
    };
  },

  categorisorAddSplit() {
    return {
      type: TrackActionTypes.CATEGORISOR_ADD_SPLIT,
    }
  },

  categorisorRemoveSplit(idx) {
    return {
      type: TrackActionTypes.CATEGORISOR_REMOVE_SPLIT,
      idx
    }
  },

  categorisorSetSplit(idx, name, value) {
    return {
      type: TrackActionTypes.CATEGORISOR_SET_SPLIT,
      idx,
      name,
      value,
    }
  },

  categorisorShow() {
    return {
      type: TrackActionTypes.CATEGORISOR_SHOW,
    };
  },

  categorisorHide() {
    return {
      type: TrackActionTypes.CATEGORISOR_HIDE,
    };
  },

  categorisorSave(transaction, splits, onDone) {
    return (dispatch, getState) => {
      let updated = transaction;
      if (splits !== null && splits.size === 1) {
          let new_category = splits.get(0).category;
          updated = updated.set("category", new_category);
      }
      return fetch_from_api(dispatch, getState, '/api/transactions/' + updated.id + '/', {
        method: 'PUT',
        body: JSON.stringify(updated),
        headers: {'Content-Type': 'application/json'}
      })
      .then(checkStatus)
      .then(resp => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_UPDATED,
            transaction: new Transaction(resp),
          });

          if (splits !== null && splits.size > 1) {
            return fetch_from_api(dispatch, getState, '/api/transactions/' + updated.id + '/split/', {
              method: 'POST',
              body: JSON.stringify(splits),
              headers: {'Content-Type': 'application/json'}
            })
            .then(checkStatus)
            .then(() => {
              dispatch({
                type: TrackActionTypes.TRANSACTION_SPLIT_SUCCESS,
              });
              onDone();
              dispatch(this.categorisorHide())
            })
            .catch(error => {
              dispatch({
                type: TrackActionTypes.TRANSACTION_SPLIT_ERROR,
                error,
              });
            });
          }
          dispatch(this.categorisorHide())
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_UPDATE_ERROR,
            error,
          });
        });
    };
  }
};

export default TrackActions;