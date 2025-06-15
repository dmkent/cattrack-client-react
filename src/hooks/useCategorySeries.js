import { useQuery } from "react-query";
import Immutable from "immutable";
import { useAuth } from "./AuthContext";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

export default function useCategorySeries(category_id) {
  const auth = useAuth();
  const fetchCategories = () =>
    fetch_from_api("/api/categories/" + category_id + "/series/", {}, auth.user?.token)
      .then(checkStatus)
      .then((series) =>
        Immutable.List(
          series.map((raw) => {
            return Immutable.Map(raw);
          })
        )
      );
  return useQuery(["categorySeries", category_id], fetchCategories, {
    enabled: !!category_id,
  });
}
