import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";

import Period from "../data/Period";
import { useAxios } from "./AxiosContext";

export default function usePeriods() {
  const axios = useAxios();
  const fetchPeriods = () =>
    axios.get("/api/periods/")
      .then(checkStatusAxios)
      .then((rawPeriods) => {
        return rawPeriods.map((rawPeriod) => {
          return new Period(rawPeriod);
        });
      });

  return useQuery("periods", fetchPeriods);
}
