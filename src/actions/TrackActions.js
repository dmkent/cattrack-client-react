import TrackActionTypes from '../data/TrackActionTypes';

import CatTrackAPI from '../client/CatTrackAPI';
import store from '../store';
import Transaction from '../data/Transaction';
import Account from '../data/Account';
import Category from '../data/Category';
import Period from '../data/Period';

function refreshLogin(dispatch) {
  const auth = store.getState().auth;
  if (!auth.is_logged_in) {
    return false;
  }
  let now = new Date();
  // 1. check if we are expired - clear auth
  if (now > auth.expires) {
      console.log("Auth expired. Expiry: " + auth);
      TrackActions.logout();
      return false;
  }

  // 2. check if more than 5 mins until expire - don't refresh
  if ((auth.expires.getTime() - now.getTime()) > 300000 ) {
      // Hasn't expired and won't in next five minutes so bail.
      return true;
  }

  // 3. not expired, but near expiry - refresh
  CatTrackAPI
  .post('/api-token-refresh/', {token: auth.token})
  .then(resp => {
    localStorage.setItem('jwt', resp.token);
    dispatch({
      type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
      token: resp.token,
    });
  })
  .catch(error => {
    dispatch({
      type: TrackActionTypes.AUTH_FAILED,
      error,
      username,
    });
  });
  return true;
}

const TrackActions = {
  addTransaction(when, description, amount) {
    return {
      type: TrackActionTypes.ADD_TRANSACTION,
      when,
      description,
      amount
    };
  },
  selectTransactions(page_num, page_size, filters) {
    const auth_token = store.getState().auth.token;
    const query_params = {
      page: page_num,
      page_size: page_size,
    }
    Object.keys(filters).forEach(function(keyval) {
      if (filters[keyval] !== null) {
        query_params[keyval] = filters[keyval];
      }
    }, this);

    return (dispatch) => {
      if (!refreshLogin(dispatch)) { 
        return;
      };
      return CatTrackAPI
        .get('/api/transactions/', query_params, auth_token)
        .then(rawTransactions => {
          dispatch({
            type: 'transactions/loaded',
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
            type: 'transactions/load-error',
            page_num,
            error,
          });
        });
    };
  },
  loadPeriods() {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) {
        return;
      }
      return CatTrackAPI
        .get('/api/periods/', {}, auth_token)
        .then(rawPeriods => {
          dispatch({
            type: 'periods/loaded',
            periods: rawPeriods.map(rawPeriod => {
                return new Period(rawPeriod);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: 'periods/load-error',
            error,
          });
        });
    };
  },
  loadAccounts() {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) {
        return;
      }
      return CatTrackAPI
        .get('/api/accounts/', {}, auth_token)
        .then(rawAccounts => {
          dispatch({
            type: 'accounts/loaded',
            accounts: rawAccounts.map(rawAccount => {
                return new Account(rawAccount);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: 'accounts/load-error',
            error,
          });
        });
    };
  },
  uploadToAccount(account, upload_file) {
    let data = new FormData();
    data.append('data_file', upload_file);
    data.append('name', name);

    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) {
        return;
      }
      return CatTrackAPI
        .upload_form('/api/accounts/' + account + '/load/',
                    data, auth_token, {
                      beforeSend: function(xhrObject){ 
                        xhrObject.onprogress = function(event){
                          dispatch({
                            type: 'accounts/upload-progress-update',
                            progress: event.loaded / event.total * 100,
                          });
                        }}
                      }
                    )
        .then(() => {
          dispatch({
            type: 'accounts/upload-success',
            account,
          });
        })
        .catch(error => {
          dispatch({
            type: 'accounts/upload-failed',
            account,
            error,
          });
        });
    };
  },

  attemptLogin(username, password) {
    return (dispatch) => {
      return CatTrackAPI
        .post('/api-token-auth/', {username: username, password: password})
        .then(resp => {
          localStorage.setItem('jwt', resp.token);
          dispatch({
            type: 'auth/response',
            token: resp.token,
          })
        })
        .catch(error => {
          dispatch({
            type: "auth/failure",
            error,
            username,
          });
        });
    };
  },
  restoreLogin() {
    const token = localStorage.getItem('jwt');
    if (token !== undefined && token !== null) {
      return {
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: token,
      };
    }
    return (dispatch) => {};
  },
  logout() {
    localStorage.removeItem('jwt');
    return {
      type: TrackActionTypes.AUTH_LOGOUT,
    };
  },

  categorisorSetTransaction(transaction) {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) {
        return;
      }

      dispatch({
        type: 'categorisor/set-transaction',
        transaction: transaction,
      });

      CatTrackAPI
        .get('/api/transactions/' + transaction.id + '/suggest', {}, auth_token)
        .then(resp => {
          dispatch({
            type: 'categorisor/suggestions-received',
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: 'categorisor/suggestions-error',
            error,
          });
        });
    }
  },

  loadCategories() {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      return CatTrackAPI
        .get('/api/categories', {}, auth_token)
        .then(resp => {
          dispatch({
            type: 'categorisor/categories-received',
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: 'categorisor/categories-error',
            error,
          });
        })
    };
  },

  categorisorAddSplit() {
    return {
      type: 'categorisor/add-split',
    }
  },

  categorisorRemoveSplit(idx) {
    return {
      type: 'categorisor/remove-split',
      idx
    }
  },

  categorisorSetSplit(idx, name, value) {
    return {
      type: 'categorisor/set-split',
      idx,
      name,
      value,
    }
  },

  categorisorHide() {
    return {
      type: 'categorisor/hide',
    };
  },

  categorisorSave(transaction, splits, onDone) {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) {
        return;
      }
      let updated = transaction;
      if (splits !== null && splits.size === 1) {
          let new_category = splits.get(0).category;
          updated = updated.set("category", new_category);
      }
      CatTrackAPI
        .put('/api/transactions/' + updated.id + '/', updated, auth_token)
        .then(resp => {
          dispatch({
            type: 'transaction/updated',
            transaction: new Transaction(resp),
          });

          if (splits !== null && splits.size > 1) {
            CatTrackAPI
              .post('/api/transactions/' + updated.id + '/split/', splits, auth_token)
              .then((resp) => {
                dispatch({
                  type: 'transaction/split-success',
                });
                onDone();
              })
              .catch(error => {
                dispatch({
                  type: 'transaction/split-error',
                  error,
                });
              });
          }
          dispatch(this.categorisorHide())
        })
        .catch(error => {
          dispatch({
            type: 'transaction/update-error',
            error,
          });
        });
    };
  }
};

export default TrackActions;