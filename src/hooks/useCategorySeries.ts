import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";

export interface CategorySeries {
  label: string;
  value: string;
}

export default function useCategorySeries(category_id: string) {
  const axios = useAxios();

  const fetchCategories = (): Promise<CategorySeries[]> =>
    axios
      .get(`/api/categories/${category_id}/series/`)
      .then(checkStatusAxios)
      .then((series: any[]) =>
        series.map((raw): CategorySeries => {
          return { ...raw };
        })
      );

  return useQuery(["categorySeries", category_id], fetchCategories, {
    enabled: !!category_id,
  });
}