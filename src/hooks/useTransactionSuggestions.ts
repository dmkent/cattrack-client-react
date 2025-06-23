import { useQuery } from "react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { useAxios } from "./AxiosContext";
import { Transaction } from "../data/Transaction";
import { Category } from "../data/Category";

export default function useTransactionSuggestions(transaction: Transaction) {
  const axios = useAxios();
  const fetchSuggestions = () =>
    axios.get("/api/transactions/" + transaction.id + "/suggest")
      .then(checkStatusAxios)
      .then((resp) => {
        return resp.map((cat: Category) => {
          return {
            id: cat.id,
            name: cat.name,
            score: cat.score
          } as Category;
        });
      });

  return useQuery<Category[]>(["suggestions", transaction.id], fetchSuggestions);
}
