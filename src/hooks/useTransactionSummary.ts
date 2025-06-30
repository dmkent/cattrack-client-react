import { useQuery } from "@tanstack/react-query";

import { filters_to_params, checkStatusAxios } from "../client/CatTrackAPI";
import { CategorySummary } from "../data/Transaction";
import { useAxios } from "./AxiosContext";

interface TransactionSummaryResponse {
  category: string;
  category_name: string;
  total: string;
}

export default function useTransactionSummaries(filters: any) {
  const axios = useAxios();
  const query_params = filters_to_params(filters);
  const fetchSummary = () =>
    axios
      .get("/api/transactions/summary/" + query_params)
      .then(checkStatusAxios)
      .then((resp: TransactionSummaryResponse[]) =>
        resp.map((item) => {
          return {
            category_id: item.category,
            category_name: item.category_name,
            total: parseFloat(item.total),
          } as CategorySummary;
        }),
      );

  return useQuery({
    queryKey: ["summary", filters],
    queryFn: fetchSummary,
  });
}
