import { useQuery } from "react-query";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Category from "../data/Category";

export default function useCategories() {
  const fetchCategories = () =>
    fetch_from_api("/api/categories/")
      .then(checkStatus)
      .then((resp) => {
        return resp.map((cat) => {
          return new Category(cat);
        });
      });
  return useQuery("categories", fetchCategories);
}
