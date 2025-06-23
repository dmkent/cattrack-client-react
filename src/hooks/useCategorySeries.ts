import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { SeriesPoint } from "src/data/Account";

interface CategorySeriesResponse {
  label: string;
  value: string;
}

export default function useCategorySeries(category_id: string) {
  const axios = useAxios();

  const fetchCategories = (): Promise<SeriesPoint[]> =>
    axios
      .get(`/api/categories/${category_id}/series/`)
      .then(checkStatusAxios)
      .then((series: any[]) =>
        series.map((raw: CategorySeriesResponse) => {
          return { label: raw.label, value: parseFloat(raw.value) };
        })
      );

  return useQuery(["categorySeries", category_id], fetchCategories, {
    enabled: !!category_id,
  });
}