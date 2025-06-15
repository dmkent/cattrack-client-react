import { fetch_from_api } from "./CatTrackAPI";
import { parseErrors } from "./ErrorParser";

export default function paymentSeriesAddBillFromFile(idx, upload_file, token) {
  let data = new FormData();
  data.append("data_file", upload_file);
  data.append("name", idx);

  return fetch_from_api("/api/payments/" + idx + "/loadpdf/", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": undefined,
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
