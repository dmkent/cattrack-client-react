import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { SeriesPoint } from "../data/Account";
import { useAxios } from "./AxiosContext";

interface CategoryGroupSeriesResponse {
  label: string;
  value: string;
}

export function useCategoryGroupSeries(categoryGroupId: string) {
  const axios = useAxios();

  const fetchCategoryGroupSeries = (): Promise<SeriesPoint[]> => {
    const fromDate = "2023-01-01";
    const toDate = new Date().toISOString().split("T")[0];

    return (
      axios
        .get(`/api/category-groups/${categoryGroupId}/weekly_summary/`, {
          params: {
            from_date: fromDate,
            to_date: toDate,
          },
        })
        .then(checkStatusAxios)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((series: any[]) =>
          series.map((raw: CategoryGroupSeriesResponse) => {
            return { label: raw.label, value: parseFloat(raw.value) };
          }),
        )
    );
  };

  return useQuery({
    queryKey: ["categoryGroupSeries", categoryGroupId],
    queryFn: fetchCategoryGroupSeries,
    enabled: !!categoryGroupId,
  });
}
