import { useQuery } from "react-query";
import { useAuth } from "./AuthContext";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Category from "../data/Category";

export default function useCategories() {
  const auth = useAuth();
  const fetchCategories = () =>
    fetch_from_api("/api/categories/", {}, auth.user?.token)
      .then(checkStatus)
      .then((resp) => {
        return resp.map((cat) => {
          return new Category(cat);
        });
      });
  return useQuery("categories", fetchCategories);
}
