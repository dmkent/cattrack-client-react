import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

export default function updateTransactionSplits(transaction, splits, onDone) {
  let updated = transaction;
  if (splits !== null && splits.size === 1) {
    let new_category = splits.get(0).category;
    updated = updated.set("category", new_category);
  }

  return fetch_from_api(null, "/api/transactions/" + updated.id + "/", {
    method: "PUT",
    body: JSON.stringify(updated),
    headers: { "Content-Type": "application/json" },
  })
    .then(checkStatus)
    .then((resp) => {
      if (splits !== null && splits.size > 1) {
        return fetch_from_api(
          null,
          "/api/transactions/" + updated.id + "/split/",
          {
            method: "POST",
            body: JSON.stringify(splits),
            headers: { "Content-Type": "application/json" },
          }
        )
          .then(checkStatus)
          .then(() => {
            onDone();
          });
      } else {
        onDone();
      }
    });
}
