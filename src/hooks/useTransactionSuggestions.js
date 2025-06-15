import { useQuery } from "react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import Category from "../data/Category";
import { useAxios } from "./AxiosContext";

export default function useTransactionSuggestions(transaction) {
  const axios = useAxios();
  const fetchSuggestions = () =>
    axios.get("/api/transactions/" + transaction.id + "/suggest")
      .then(checkStatusAxios)
      .then((resp) => {
        return resp.map((cat) => {
          return new Category(cat);
        });
      });

  return useQuery(["suggestions", transaction.id], fetchSuggestions);
}
