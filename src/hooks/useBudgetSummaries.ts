import moment from "moment";
import { useQuery } from "react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { useAxios } from "./AxiosContext";

interface BudgetSummary {
  [key: string]: any;
}

export default function useBudgetSummaries(
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
  const fetchSummaries = (): Promise<BudgetSummary> =>
    axios
      .get(`/api/categories/summary/${fromStr}/${toStr}/`)
      .then(checkStatusAxios)
      .then((raw: BudgetSummary) => {
        return raw;
      });

  return useQuery(["budget_summaries", from_date, to_date], fetchSummaries);
}
