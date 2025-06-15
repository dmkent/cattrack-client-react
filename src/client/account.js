import { fetch_from_api, checkStatus } from "./CatTrackAPI";
import { parseErrors } from "./ErrorParser";

import Account from "../data/Account";

export function uploadToAccount(account, upload_file, token) {
  let data = new FormData();
  data.append("data_file", upload_file);
  data.append("name", account.name);

  return fetch_from_api("/api/accounts/" + account.id + "/load/", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": null, // allow override to make forms work
    },
  }, token)
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
      return Promise.reject(new Error(message));
    });
}

export function createAccount(name, token) {
  return fetch_from_api("/api/accounts/", {
    method: "POST",
    body: JSON.stringify({ name: name }),
  }, token)
    .then(checkStatus)
    .then((newAccount) => new Account(newAccount));
}
