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

export function isString(val) {
  return typeof val === "string" || val instanceof String;
}

export function camelCaseToVerbose(text) {
  return text.replace(/(\w)([A-Z])/g, "$1 $2");
}

export function underscoredToVerbose(text) {
  return text.replace(/[\d_]/g, " ");
}

export function capitalise(text) {
  let cap_text = text.toLowerCase();
  cap_text = cap_text.charAt(0).toUpperCase() + cap_text.slice(1);
  return cap_text;
}

/**
 * Parse JSON data from Django REST framework error.
 *
 * Based on https://gist.github.com/kottenator/433f677e5fdddf78d195
 * @param {Object} item - decoded JSON data to parse errors out of.
 * @returns {Array} - array of key, value pairs that should be rendered as error message.x
 */
export function parseErrors(item) {
  return Object.entries(item).map(function ([key, value]) {
    let formatted_key = key;
    let content = "";

    if (isString(value)) {
      content = value;
    } else if (Array.isArray(value)) {
      if (isString(value[0])) {
        content = value.join(" ");
      } else {
        content = JSON.stringify(value, {}, 2);
      }
    }

    if (content) {
      if (formatted_key.search(/[A-Z]/) != -1) {
        formatted_key = camelCaseToVerbose(formatted_key);
      }

      if (formatted_key.search(/[\d_]/) != -1) {
        formatted_key = underscoredToVerbose(formatted_key);
      }

      formatted_key = capitalise(formatted_key);

      return formatted_key + ": " + content;
    }
    return formatted_key;
  });
}
