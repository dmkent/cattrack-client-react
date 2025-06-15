import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import Immutable from "immutable";

import {
  filters_to_params,
  checkStatusAxios,
} from "../client/CatTrackAPI";

export default function useTransactionSummaries(filters) {
  const axios = useAxios();
  const query_params = filters_to_params(filters);
  const fetchSummary = () =>
    axios.get("/api/transactions/summary/" + query_params)
      .then(checkStatusAxios)
      .then((resp) =>
        Immutable.OrderedMap(resp.map((item) => [item.category, item]))
      );

  return useQuery(["summary", filters], fetchSummary);
}
