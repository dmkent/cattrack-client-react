import TrackActionTypes from '../data/TrackActionTypes';

import CatTrackAPI from '../client/CatTrackAPI';
import store from '../store';
import Transaction from '../data/Transaction';
import Account from '../data/Account';

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
  selectTransactionPage(page_num) {
    const auth_token = store.getState().auth.token;
    const page_size = store.getState().transactions.page_size;
    return (dispatch) => {
      if (!refreshLogin(dispatch)) { 
        return;
      };
      return CatTrackAPI
        .get('/api/transactions/', {page: page_num, page_size: page_size}, auth_token)
        .then(rawTransactions => {
          dispatch({
            type: 'transactions/loaded',
            page_num: page_num,
            transactions: rawTransactions.results.map(rawTransaction => {
                return new Transaction(rawTransaction);
            }),
            num_records: rawTransactions.count,
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
  loadAccounts() {
    const auth_token = store.getState().auth.token;
    return (dispatch) => {
      refreshLogin(dispatch);
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
  }
};

export default TrackActions;