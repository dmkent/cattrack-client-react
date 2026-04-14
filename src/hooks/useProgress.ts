import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { ProgressResponse } from "../data/Progress";
import { useAxios } from "./AxiosContext";

export type ProgressGroupBy = "category" | "category_group";

interface UseProgressParams {
  from_date: string | null;
  to_date: string | null;
  group_by: ProgressGroupBy;
}

export function useProgress(params: UseProgressParams) {
  const axios = useAxios();

  const fetchProgress = (): Promise<ProgressResponse> =>
    axios
      .get("/api/progress/", {
        params: {
          from_date: params.from_date,
          to_date: params.to_date,
          group_by: params.group_by,
        },
      })
      .then(checkStatusAxios)
      .then((raw) => raw as ProgressResponse);

  return useQuery({
    queryKey: ["progress", params.from_date, params.to_date, params.group_by],
    queryFn: fetchProgress,
    enabled: !!(params.from_date && params.to_date),
  });
}
