import { useQuery } from "@tanstack/react-query";

import { filters_to_params, checkStatusAxios } from "../client/CatTrackAPI";
import { CategorySummary } from "../data/Transaction";
import { PaginatedTransactionFilters } from "../data/TransactionFilters";
import { useAxios } from "./AxiosContext";

interface TransactionSummaryResponse {
  category: string;
  category_name: string;
  subcategory: string;
  total: string;
}

export function useTransactionSummaries(
  filters: Partial<PaginatedTransactionFilters>,
) {
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
            subcategory: item.subcategory,
            total: parseFloat(item.total),
          } as CategorySummary;
        }),
      );

  return useQuery({
    queryKey: ["summary", filters],
    queryFn: fetchSummary,
  });
}
