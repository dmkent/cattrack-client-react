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
import * as Cookies from "js-cookie";
import fetch from "isomorphic-fetch";
import { AxiosResponse } from "axios";

import { parseErrors } from "./ErrorParser";

import CONFIG from "ctrack_config";
import { useAuthToken } from "../hooks/useAuthToken";
const API_URI = CONFIG.API_URI;

export function refreshLogin() {
  let now = new Date();
  const auth = useAuthToken();

  // 1. check if we are expired - clear auth
  if (auth.expires && now > auth.expires) {
    console.log("Auth expired. Expiry: " + auth);
    localStorage.removeItem("jwt");
    return Promise.reject(new Error("Auth has expired."));
  }

  // 1a. Otherwise failed.
  if (!auth.is_logged_in) {
    return Promise.reject(new Error("Not logged in."));
  }

  // 2. check if more than 5 mins until expire - don't refresh
  if (auth.expires && auth.expires.getTime() - now.getTime() > 300000) {
    // Hasn't expired and won't in next five minutes so bail.
    return Promise.resolve(null);
  }

  // 3. not expired, but near expiry - refresh
  return fetch(API_URI + "/api-token-refresh/", {
    method: "POST",
    body: JSON.stringify({ token: auth.token }),
    headers: { "Content-Type": "application/json" },
  })
    .then(checkStatus)
    .then((resp) => {
      localStorage.setItem("jwt", resp.token);
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(new Error("Auth failed."));
    });
}

/**
 * Convenience wrapper around fetch.
 *
 * Performs an authentication check/refresh then performs a fetch with correct
 * authentication headers.
 *
 * @param {func} dispatch - Store's dispatch function.
 * @param {string} uri - URI to fetch, sub-url only, base is set in config.
 * @param {Object} options - options passed through to fetch.
 * @returns {Promise} Promise result from fetch.
 */
export function fetch_from_api(uri: string, options: RequestInit | undefined = {}, token?: string) {
  // Set up authentication and security headers.
  const headers = options?.headers ? new Headers(options.headers) : new Headers();
  if (!headers.has("Content-Type"))
  {
    headers.set("Content-Type", "application/json");
  }

  /* Force content type to undefined, allows browser to deal with content
      type for multipart form-data. Needs to set boundary as part of content
      type. */
  if (headers.get("Content-Type") === 'null') {
    headers.delete("Content-Type");
  }

  if (token !== undefined) {
    headers.set("Authorization", "Bearer " + token);
  }
  const csrf_token = Cookies.get("csrftoken");
  if (csrf_token) {
    headers.set("X-CSRFToken", csrf_token);
  }
  options.headers = headers;
  return fetch(API_URI + uri, {
    ...options,
  });
}

type TransactionFilters = {
  from_date?: string;
  to_date?: string;
  category?: string;
  has_category?: "True" | "False";
  account: string;
}

/**
 * Converts an object to a URL encoded string of GET paramters.
 *
 * Values that are null are ignored.
 *
 * @param {Object} filters - The filters to be converted.
 * @returns {string} A string that can be appended to URL.
 */
export function filters_to_params(filters : TransactionFilters) {
  let query_params = Object.entries(filters)
    .map(([key, val]) => {
      if (val !== null) {
        return `${key}=${val}`;
      }
      return null;
    })
    .filter((val) => {
      return val !== null;
    })
    .join("&");
  if (query_params.length > 0) {
    query_params = "?" + query_params;
  }
  return query_params;
}

/**
 * Check the status of a response from fetch.
 *
 * This in turn returns a Promise. Best used directly after the call to fetch.
 * Will check HTTP status and cause a promise rejection if the response was
 * not a success code. If it is successful will resolve to the JSON data of the
 * response.
 *
 * @param {Object} resp - The fetch response object.
 * @returns {Promise} A promise that will be rejected if fetch was not succesful.
 */
export function checkStatus(resp: Response) {
  if (resp === undefined) {
    return Promise.reject(new Error("No response received"));
  } else if (resp.status >= 200 && resp.status <= 299) {
    return resp.json();
  }

  /* At this point we have an error. Try and decode the JSON response
     for an error message.*/
  return Promise.resolve(resp.json())
    .catch(() => {
      // Decode of JSON error message failed so just reject with generic message.
      return Promise.reject(new Error("Unable to decode response as JSON."));
    })
    .then((error) => {
      // Decoded JSON, parse and then reject with result.
      return Promise.reject(new Error(parseErrors(error).join(", ")));
    });
}

/**
 * Check the status of a response from fetch.
 *
 * This in turn returns a Promise. Best used directly after the call to fetch.
 * Will check HTTP status and cause a promise rejection if the response was
 * not a success code. If it is successful will resolve to the JSON data of the
 * response.
 *
 * @param {Object} resp - The fetch response object.
 * @returns {Promise} A promise that will be rejected if fetch was not succesful.
 */
export function checkStatusAxios(resp: AxiosResponse) {
  if (resp === undefined) {
    return Promise.reject(new Error("No response received"));
  } else if (resp.status >= 200 && resp.status <= 299) {
    return resp.data;
  }

  /* At this point we have an error. Try and decode the JSON response
     for an error message.*/
  return Promise.resolve(resp.data)
    .catch(() => {
      // Decode of JSON error message failed so just reject with generic message.
      return Promise.reject(new Error("Unable to decode response as JSON."));
    })
    .then((error) => {
      // Decoded JSON, parse and then reject with result.
      return Promise.reject(new Error(parseErrors(error).join(", ")));
    });
}
