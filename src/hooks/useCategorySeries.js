import { useQuery } from "react-query";
import Immutable from "immutable";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

export default function useCategorySeries(category_id) {
  const fetchCategories = () =>
    fetch_from_api(null, "/api/categories/" + category_id + "/series/")
      .then(checkStatus)
      .then((series) => Immutable.List(
          series.map((raw) => {
            return Immutable.Map(raw);
          })
        )
      )
  return useQuery(["categorySeries", category_id], fetchCategories, {enabled: !!category_id});
}
