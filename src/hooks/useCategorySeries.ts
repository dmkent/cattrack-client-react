import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { SeriesPoint } from "../data/Account";
import { useAxios } from "./AxiosContext";

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
        }),
      );

  return useQuery({
    queryKey: ["categorySeries", category_id],
    queryFn: fetchCategories,
    enabled: !!category_id,
  });
}
