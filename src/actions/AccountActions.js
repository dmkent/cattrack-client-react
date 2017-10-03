import TrackActionTypes from '../data/TrackActionTypes';

import {fetch_from_api, checkStatus} from '../client/CatTrackAPI';
import {parseErrors} from '../client/ErrorParser'

import Account from '../data/Account';

const AccountActions = {
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
  selectAccount(account) {
    return {
      type: TrackActionTypes.ACCOUNT_SELECTED,
      account: account,
    }
  },
  uploadToAccount(account, upload_file) {
    let data = new FormData();
    data.append('data_file', upload_file);
    data.append('name', account);
    
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/accounts/' + account.id + '/load/', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': undefined
        }
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
      .catch(() => {
        // Parse of JSON failed.
        dispatch({
          type: TrackActionTypes.ACCOUNT_UPLOAD_ERROR,
          account,
          error: new Error("Unable to upload."),
        })
      })
      .then((data) => {
          if (data === null) {
            return;
          }
          dispatch({
            type: TrackActionTypes.ACCOUNT_UPLOAD_ERROR,
            account,
            error: new Error(parseErrors(data)),
          })
        });
    };
  },
  createAccount(name) {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/accounts/', {
        method: 'POST',
        body: JSON.stringify({name: name}),
      })
      .then(checkStatus)
      .then((newAccount) => {
        dispatch({
          type: TrackActionTypes.ACCOUNT_CREATE_SUCCESS,
          account: new Account(newAccount)
        });
      })
      .catch((error) => {
        dispatch({
          type: TrackActionTypes.ACCOUNT_CREATE_ERROR,
          name: name,
          error: error,
        })
        });
    };
  },
  loadAccountBalanceSeries(account) {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/accounts/' + account.id + '/series/')
        .then(checkStatus)
        .then((series) => {
          dispatch({
            type: TrackActionTypes.ACCOUNT_BALANCE_SERIES_LOADED,
            account: account,
            series: series
          })
        })
        .catch((error) => {
          dispatch({
            type: TrackActionTypes.ACCOUNT_BALANCE_SERIES_LOAD_ERROR,
            error: error
          })
        })
    }
  }
};

export default AccountActions;