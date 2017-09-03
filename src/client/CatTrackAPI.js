/**
 * API to go and fetch from server.
 * 
 * Based of flux TODO example.
 * 
 * Copyright (c) 2017, David M Kent.
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import xhr from 'xhr';

type TransactionObject = {
  id: string,
  when: string,
  description: string,
  account: string,
  amount: number,
};

// Using some flow trickery we can strongly type our requests! We don't verify
// this at runtime though, so it's not actually sound. But we're all good if
// we trust the API implementation :)
declare class CatTrackAPI {
  static get(uri: '/api/transactions/', data: {page: number, page_size: number}): Promise<Array<TransactionObject>>;
}

// $FlowExpectedError: Intentional rebinding of variable.
const CatTrackAPI = {
  get(uri, data, token) {
    return promiseXHR('get', uri, data, token);
  },

  post(uri, data, token) {
    return promiseXHR('post', uri, data, token);
  },

  put(uri, data, token) {
    return promiseXHR('put', uri, data, token);
  },

  upload_form(uri, formdata, token, options) {
    return promiseXHRFormUpload(uri, formdata, token, options);
  },
};

/**
 * This is a simple wrapper around XHR that let's us use promises. Not very
 * advanced but works with our server's API.
 */
function promiseXHR(method: 'get' | 'post' | 'put', uri, data, token) {
  let API_URI = "http://localhost:8080"
  if (process.env.NODE_ENV === 'production') {
    API_URI = '/be';
  }

  let send_body = null;
  let suffix = '';
  let headers = {};
  if (method == 'post' || method == 'put') {
    send_body = JSON.stringify(data);
    headers["Content-Type"] = "application/json";
  } else {
  const query = [];
    if (data) {
      Object.keys(data).forEach(key => {
        query.push(key + '=' + data[key]);
      });
    }
    suffix = query.length > 0
      ? '?' + query.join('&')
      : '';
  }
  
  if (token !== undefined) {
    headers['Authorization'] = 'JWT ' + token;
  }
  return new Promise((resolve, reject) => {
    xhr[method]({
        uri: API_URI + uri + suffix,
        body: send_body,
        headers: headers,
      },
      (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(
            '[status: ' + res.statusCode + '] ' + res.body,
          ));
          return;
        }

        // It's fine if the body is empty.
        if (body == null) {
          resolve(undefined);
        }

        // Not okay if the body isn't a string though.
        if (typeof body !== 'string') {
          reject(new Error('Responses from server must be JSON strings.'));
        }

        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Responses from server must be JSON strings.'));
        }
      },
    );
  });
}

function promiseXHRFormUpload(uri, formdata, token, options) {
  let headers = {};

  if (token !== undefined) {
    headers['Authorization'] = 'JWT ' + token;
  }
  return new Promise((resolve, reject) => {
    xhr.post({
        uri: PREFIX + uri,
        body: formdata,
        headers: headers,
        ...options
      },
      (err, res, body) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(
            '[status: ' + res.statusCode + '] ' + res.body,
          ));
          return;
        }

        // It's fine if the body is empty.
        if (body == null) {
          resolve(undefined);
        }

        // Not okay if the body isn't a string though.
        if (typeof body !== 'string') {
          reject(new Error('Responses from server must be JSON strings.'));
        }

        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Responses from server must be JSON strings.'));
        }
      },
    );
  });
}
export default CatTrackAPI;
