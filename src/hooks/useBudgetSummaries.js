import moment from "moment";
import { useQuery } from "react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { useAxios } from "./AxiosContext";

export default function useBudgetSummaries(from_date, to_date) {
  const axios = useAxios();
  const toStr = to_date
    ? to_date.replace("-", "")
    : moment().format("YYYYMMDD");
  const fromStr = from_date
    ? from_date.replace("-", "")
    : moment().subtract(1, "month").format("YYYYMMDD");
  const fetchSummaries = () =>
    axios.get(`/api/categories/summary/${fromStr}/${toStr}/`)
      .then(checkStatusAxios)
      .then((raw) => {
        return raw;
      });

  return useQuery(["budget_summaries", from_date, to_date], fetchSummaries);
}
