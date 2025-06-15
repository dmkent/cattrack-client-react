import { useQuery } from "react-query";
import { useAuth } from "./AuthContext";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Period from "../data/Period";

export default function usePeriods() {
  const auth = useAuth();
  const fetchPeriods = () =>
    fetch_from_api("/api/periods/", {}, auth.user?.token)
      .then(checkStatus)
      .then((rawPeriods) => {
        return rawPeriods.map((rawPeriod) => {
          return new Period(rawPeriod);
        });
      });

  return useQuery("periods", fetchPeriods);
}
