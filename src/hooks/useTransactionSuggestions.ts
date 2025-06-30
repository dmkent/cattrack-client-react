import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { Category } from "../data/Category";
import { Transaction } from "../data/Transaction";
import { useAxios } from "./AxiosContext";

export default function useTransactionSuggestions(transaction: Transaction) {
  const axios = useAxios();
  const fetchSuggestions = () =>
    axios
      .get("/api/transactions/" + transaction.id + "/suggest")
      .then(checkStatusAxios)
      .then((resp) => {
        return resp.map((cat: Category) => {
          return {
            id: cat.id,
            name: cat.name,
            score: cat.score,
          } as Category;
        });
      });

  return useQuery<Category[]>({
    queryKey: ["suggestions", transaction.id],
    queryFn: fetchSuggestions,
  });
}
