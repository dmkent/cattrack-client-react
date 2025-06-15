import { useQuery } from "react-query";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";
import { useAuth } from "./AuthContext";
import Category from "../data/Category";

export default function useTransactionSuggestions(transaction) {
  const auth = useAuth();
  const fetchSuggestions = () =>
    fetch_from_api("/api/transactions/" + transaction.id + "/suggest", {}, auth.user?.token)
      .then(checkStatus)
      .then((resp) => {
        return resp.map((cat) => {
          return new Category(cat);
        });
      });

  return useQuery(["suggestions", transaction.id], fetchSuggestions);
}
