import { useQuery } from "react-query";
import Immutable from "immutable";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";

export default function useCategorySeries(category_id) {
  const axios = useAxios();

  const fetchCategories = () =>
    axios
      .get(`/api/categories/${category_id}/series/`)
      .then(checkStatusAxios) // Validate the response using checkStatusAxios
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
