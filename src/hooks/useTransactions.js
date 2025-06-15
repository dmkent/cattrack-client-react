import { useQuery } from "react-query";

import {
  checkStatusAxios,
  filters_to_params,
} from "../client/CatTrackAPI";
import Transaction from "../data/Transaction";
import { useAxios } from "./AxiosContext";

export default function useTransactions(page, pageSize, filters) {
  const axios = useAxios();
  const params = filters_to_params({
    page: page,
    page_size: pageSize,
    ...filters,
  });

  const fetchTransactions = () =>
    axios.get("/api/transactions/" + params)
      .then(checkStatusAxios)
      .then((rawTransactions) => {
        return {
          transactions: rawTransactions.results.map((rawTransaction) => {
            return new Transaction(rawTransaction);
          }),
          num_records: rawTransactions.count,
        };
      });

  return useQuery(
    ["transactions", page, pageSize, filters],
    fetchTransactions,
    { keepPreviousData: true }
  );
}
