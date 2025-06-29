import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios, filters_to_params } from "../client/CatTrackAPI";
import { Transaction } from "../data/Transaction";
import { useAxios } from "./AxiosContext";

export default function useTransactions(
  page: number,
  pageSize: number,
  filters: any,
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
      .then((rawTransactions: any) => {
        return {
          transactions: rawTransactions.results.map(
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
