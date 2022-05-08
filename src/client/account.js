import Immutable from "immutable";
import { fetch_from_api, checkStatus } from "./CatTrackAPI";
import { parseErrors } from "./ErrorParser";

import Account from "../data/Account";

export function loadAccounts() {
  return fetch_from_api("/api/accounts/")
    .then(checkStatus)
    .then((rawAccounts) => 
      rawAccounts.map((rawAccount) => {
        return new Account(rawAccount);
      })
    )
};

export function uploadToAccount(account, upload_file) {
  let data = new FormData();
  data.append("data_file", upload_file);
  data.append("name", account.name);

  return fetch_from_api(
    "/api/accounts/" + account.id + "/load/",
    {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": undefined,
      },
    }
  )
  .then((resp) => {
    if (resp.status == 200) {
      // All done. Resolve to null.
      return Promise.resolve(null);
    }
    // Non-200 status, parse the content
    return resp.json();
  })
  .catch(() => {
    // Parse of JSON failed.
  })
  .then((data) => {
    let message = "";
    if (data === null) {
      return;
    } else if (data instanceof Object) {
      message = parseErrors(data);
    } else {
      message = data;
    }
    return Promise.reject(new Error(message))
  });
};

export function createAccount(name) {
  return fetch_from_api("/api/accounts/", {
    method: "POST",
    body: JSON.stringify({ name: name }),
  })
    .then(checkStatus)
    .then((newAccount) => new Account(newAccount))
};

export function loadAccountBalanceSeries(account) {
  return fetch_from_api(
    "/api/accounts/" + account.id + "/series/"
  )
    .then(checkStatus)
    .then((series) => Immutable.List(
      series.map((raw) => {
        return Immutable.Map(raw);
      })
    ))
};
