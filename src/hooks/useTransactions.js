import { useQuery } from "react-query";

import {
  fetch_from_api,
  checkStatus,
  filters_to_params,
} from "../client/CatTrackAPI";
import { useAuth } from "./AuthContext";
import Transaction from "../data/Transaction";

export default function useTransactions(page, pageSize, filters) {
  const auth = useAuth();
  const params = filters_to_params({
    page: page,
    page_size: pageSize,
    ...filters,
  });

  const fetchTransactions = () =>
    fetch_from_api("/api/transactions/" + params, {}, auth.user?.token)
      .then(checkStatus)
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
