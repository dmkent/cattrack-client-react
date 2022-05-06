import { useQuery } from "react-query";

import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";

import Period from "../data/Period";

export default function usePeriods() {
  const fetchPeriods = () =>
    fetch_from_api(null, "/api/periods/")
      .then(checkStatus)
      .then((rawPeriods) => {
        return rawPeriods.map((rawPeriod) => {
          return new Period(rawPeriod);
        });
      });

  return useQuery("periods", fetchPeriods);
}
