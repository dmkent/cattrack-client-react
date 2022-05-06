import { useQuery } from "react-query";
import Immutable from "immutable";

import { fetch_from_api, filters_to_params, checkStatus } from "../client/CatTrackAPI";

export default function useTransactionSuggestions(filters) {
  const query_params = filters_to_params(filters);
  const fetchSummary = () =>
    fetch_from_api(null, "/api/transactions/summary/" + query_params)
      .then(checkStatus)
      .then((resp) => Immutable.OrderedMap(
        resp.map((item) => [item.category, item])
      ))

  return useQuery(["summary", filters], fetchSummary);
}
