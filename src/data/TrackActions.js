import TrackActionTypes from './TrackActionTypes';
import TrackDispatcher from './TrackDispatcher';

import CatTrackAPI from '../client/CatTrackAPI';
import AuthStore from './AuthStore';
import CatTrackStore from './CatTrackStore';
import Transaction from './Transaction';

const Actions = {
  addTransaction(when, description, amount) {
    TrackDispatcher.dispatch({
      type: TrackActionTypes.ADD_TRANSACTION,
      when,
      description,
      amount
    });
  },
  selectTransactionPage(page_num) {
    this.refreshLogin();
    const auth_token = AuthStore.getState().token;
    const page_size = CatTrackStore.getState().page_size;
    CatTrackAPI
      .get('/api/transactions/', {page: page_num, page_size: page_size}, auth_token)
      .then(rawTransactions => {
        TrackDispatcher.dispatch({
          type: 'transactions/loaded',
          page_num: page_num,
          transactions: rawTransactions.results.map(rawTransaction => {
              return new Transaction(rawTransaction);
          }),
          num_records: rawTransactions.count,
        });
      })
      .catch(error => {
        TrackDispatcher.dispatch({
          type: 'transactions/load-error',
          page_num,
          error,
        });
      });
  },
  uploadToAccount(account, upload_file) {
    let data = new FormData();
    data.append('data_file', upload_file);
    data.append('name', name);

    const auth_token = AuthStore.getState().token;
    CatTrackAPI
      .upload_form('/api/accounts/' + account + '/load/',
                   data, auth_token, {
                     beforeSend: function(xhrObject){ 
                       xhrObject.onprogress = function(event){
                        TrackDispatcher.dispatch({
                          type: 'accounts/upload-progress-update',
                          progress: event.loaded / event.total * 100,
                        });
                       }}
                    }
                  )
      .then(() => {
        TrackDispatcher.dispatch({
          type: 'accounts/upload-success',
          account,
        });
      })
      .catch(error => {
        TrackDispatcher.dispatch({
          type: 'accounts/upload-failed',
          account,
          error,
        });
      });
  },

  attemptLogin(username, password) {
    CatTrackAPI
      .post('/api-token-auth/', {username: username, password: password})
      .then(resp => {
        localStorage.setItem('jwt', resp.token);
        TrackDispatcher.dispatch({
          type: 'auth/response',
          token: resp.token,
        })
      })
      .catch(error => {
        TrackDispatcher.dispatch({
          type: "auth/failure",
          error,
          username,
        });
      });
  },
  refreshLogin() {
    const auth = AuthStore.getState();
    if (!auth.is_logged_in) {
      return;
    }
    let now = new Date();
    // 1. check if we are expired - clear auth
    if (now > auth.expires) {
        this.logout();
    }

    // 2. check if more than 5 mins until expire - don't refresh
    if ((auth.expires.getTime() - now.getTime()) > 300000 ) {
        // Hasn't expired and won't in next five minutes so bail.
        return;
    }

    // 3. not expired, but near expiry - refresh
    CatTrackAPI
    .post('/api-token-refresh/', {token: auth.token})
    .then(resp => {
      localStorage.setItem('jwt', resp.token);
      TrackDispatcher.dispatch({
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: resp.token,
      });
    })
    .catch(error => {
      TrackDispatcher.dispatch({
        type: TrackActionTypes.AUTH_FAILED,
        error,
        username,
      });
    });
  },
  restoreLogin() {
    const token = localStorage.getItem('jwt');
    if (token !== undefined && token !== null) {
      TrackDispatcher.dispatch({
        type: TrackActionTypes.AUTH_RESPONSE_RECEIVED,
        token: token,
      });
    }
  },
  logout() {
    localStorage.removeItem('jwt');
    TrackDispatcher.dispatch({
      type: TrackActionTypes.AUTH_LOGOUT,
    });
  }
};

export default Actions;