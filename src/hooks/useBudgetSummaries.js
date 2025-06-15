import moment from "moment";
import { useQuery } from "react-query";

import { useAuth } from "./AuthContext";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

export default function useBudgetSummaries(from_date, to_date) {
  const auth = useAuth();
  const toStr = to_date
    ? to_date.replace("-", "")
    : moment().format("YYYYMMDD");
  const fromStr = from_date
    ? from_date.replace("-", "")
    : moment().subtract(1, "month").format("YYYYMMDD");
  const fetchSummaries = () =>
    fetch_from_api(`/api/categories/summary/${fromStr}/${toStr}/`, {}, auth.user?.token)
      .then(checkStatus)
      .then((raw) => {
        return raw;
      });

  return useQuery(["budget_summaries", from_date, to_date], fetchSummaries);
}
