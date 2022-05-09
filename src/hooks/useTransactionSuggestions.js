import { useQuery } from "react-query";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Category from "../data/Category";

export default function useTransactionSuggestions(transaction) {
  const fetchSuggestions = () =>
    fetch_from_api("/api/transactions/" + transaction.id + "/suggest")
      .then(checkStatus)
      .then((resp) => {
        return resp.map((cat) => {
          return new Category(cat);
        });
      });

  return useQuery(["suggestions", transaction.id], fetchSuggestions);
}
