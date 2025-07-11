import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { BudgetSummary } from "../data/Category";
import { useAxios } from "./AxiosContext";

export function useBudgetSummaries(
  from_date: string | null,
  to_date: string | null,
) {
  const axios = useAxios();
  const toStr = to_date
    ? to_date.replace("-", "")
    : moment().format("YYYYMMDD");
  const fromStr = from_date
    ? from_date.replace("-", "")
    : moment().subtract(1, "month").format("YYYYMMDD");
  const fetchSummaries = (): Promise<BudgetSummary[]> =>
    axios
      .get(`/api/categories/summary/${fromStr}/${toStr}/`)
      .then(checkStatusAxios)
      .then((raw) => raw as BudgetSummary[]);

  return useQuery({
    queryKey: ["budget_summaries", from_date, to_date],
    queryFn: fetchSummaries,
  });
}
