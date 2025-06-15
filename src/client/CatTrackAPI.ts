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
import { AxiosResponse } from "axios";

import { parseErrors } from "./ErrorParser";

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
