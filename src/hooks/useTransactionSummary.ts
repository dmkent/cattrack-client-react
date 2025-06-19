import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";

import {
  filters_to_params,
  checkStatusAxios,
} from "../client/CatTrackAPI";

interface TransactionSummary {
  category: string | number;
  [key: string]: any;
}

export default function useTransactionSummaries(filters: any) {
  const axios = useAxios();
  const query_params = filters_to_params(filters);
  const fetchSummary = () =>
    axios.get("/api/transactions/summary/" + query_params)
      .then(checkStatusAxios)
      .then((resp: TransactionSummary[]) => {
        const summaryMap = new Map();
        resp.forEach((item) => {
          summaryMap.set(item.category, item);
        });
        return summaryMap;
      });

  return useQuery(["summary", filters], fetchSummary);
}