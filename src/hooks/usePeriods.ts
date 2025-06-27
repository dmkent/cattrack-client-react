import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { Period } from "../data/Period";
import { useAxios } from "./AxiosContext";

export default function usePeriods() {
  const axios = useAxios();
  const fetchPeriods = (): Promise<Period[]> =>
    axios
      .get("/api/periods/")
      .then(checkStatusAxios)
      .then((rawPeriods: any[]) => {
        return rawPeriods.map(
          (rawPeriod): Period => ({
            id: rawPeriod.id,
            offset: rawPeriod.offset,
            label: rawPeriod.label,
            from_date: rawPeriod.from_date,
            to_date: rawPeriod.to_date,
          }),
        );
      });

  return useQuery("periods", fetchPeriods);
}
