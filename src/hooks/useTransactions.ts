import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios, filters_to_params } from "../client/CatTrackAPI";
import { Transaction } from "../data/Transaction";
import { TransactionFilters } from "../data/TransactionFilters";
import { useAxios } from "./AxiosContext";

export default function useTransactions(
  page: number,
  pageSize: number,
  filters: TransactionFilters,
) {
  const axios = useAxios();
  const params = filters_to_params({
    page: page,
    page_size: pageSize,
    ...filters,
  });

  const fetchTransactions: () => Promise<{
    num_records: number;
    transactions: Transaction[];
  }> = () =>
    axios
      .get("/api/transactions/" + params)
      .then(checkStatusAxios)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((rawTransactions: any) => {
        return {
          transactions: rawTransactions.results.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rawTransaction: any): Transaction => {
              return {
                id: rawTransaction.id,
                when: rawTransaction.when,
                description: rawTransaction.description,
                amount: rawTransaction.amount,
                category: rawTransaction.category,
                category_name: rawTransaction.category_name,
                account: rawTransaction.account,
              };
            },
          ),
          num_records: rawTransactions.count,
        };
      });

  return useQuery({
    queryKey: ["transactions", page, pageSize, filters],
    queryFn: fetchTransactions,
    placeholderData: (previousData) => previousData,
  });
}
