/**
 * API to go and fetch from server.
 * 
 * 
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as Cookies from "js-cookie"
import fetch from 'isomorphic-fetch';

import TrackActionTypes from '../data/TrackActionTypes';
import {parseErrors} from './ErrorParser'

export const API_URI = (process.env.NODE_ENV === 'production') ? '/be' : "http://localhost:8000";

export function refreshLogin(dispatch, getState) {
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
      localStorage.removeItem('jwt');
      dispatch({
        type: TrackActionTypes.AUTH_LOGOUT,
      });
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

export function fetch_from_api(dispatch, getState, uri, options = {}) {
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

export function filters_to_params(filters) {
  let query_params = Object.entries(filters).map(([
      key, 
      val
    ]) => {
    if (val !== null) {
      return `${key}=${val}`;
    }
    return null;
  })
    .filter((val) => {return (val !== null)})
    .join('&');
  if (query_params.length > 0) {
    query_params = '?' + query_params;
  }
  return query_params;
}

export function checkStatus(resp) {
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