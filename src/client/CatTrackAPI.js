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
import * as Cookies from "js-cookie"
import xhr from 'xhr';

function parseErrors(data) {
    /**
     * Based on https://gist.github.com/kottenator/433f677e5fdddf78d195
     */

    function isString(val) {
      return (typeof val === 'string' || val instanceof String);
    }

    function _camelCaseToVerbose(text) {
        return text.replace(/(?=[A-Z])/g, ' ');
    }
    
    function _underscoredToVerbose(text) {
        return text.replace(/[\d_]/g, ' ');
    }
    
    function _capitalize(text) {
        text = text.toLowerCase();
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
    }

    function _parseErrorItem(item, listPos) {
        var output = [];

        Object.entries(item).map(function([key, value]) {
            var content;

            if (isString(value)) {
                content = value;
            } else if (Array.isArray(value)) {
                if (isString(value[0])) {
                    content = value.join(' ');
                } else {
                    content = JSON.stringify(value, {}, 2);
                }
            }

            if (content) {
                if (key.search(/[A-Z]/) != -1)
                    key = _camelCaseToVerbose(key);
                
                if (key.search(/[\d_]/) != -1)
                    key = _underscoredToVerbose(key);
                
                key = _capitalize(key);
                
                output.push([key, content]);
            }
        });
        return output;
    }

    return _parseErrorItem(data);
};

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
  let API_URI = "http://localhost:8000"
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
  
  const csrf_token = Cookies.get("csrftoken");
  if (csrf_token !== null) {
    headers['X-CSRFToken'] = csrf_token;
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
          reject({
            code: res.statusCode,
            message: parseErrors(JSON.parse(res.body)),
          });
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
  let API_URI = "http://localhost:8000"
  if (process.env.NODE_ENV === 'production') {
    API_URI = '/be';
  }
  
  let headers = {};
  const csrf_token = Cookies.get("csrftoken");
  if (csrf_token !== null) {
    headers['X-CSRFToken'] = csrf_token;
  }

  if (token !== undefined) {
    headers['Authorization'] = 'JWT ' + token;
  }
  return new Promise((resolve, reject) => {
    xhr.post({
        uri: API_URI + uri,
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
          reject({
            code: res.statusCode,
            message: parseErrors(JSON.parse(res.body)),
          });
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
