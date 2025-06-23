import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { Account, SeriesPoint } from "../data/Account";

interface AccountSeriesResponse {
  label: string;
  value: string;
}

export default function useAccountSeries(accountId: string | undefined) {
  const axios = useAxios();

  return useQuery<SeriesPoint[]>(
    ["account_series", accountId],
    () => axios
      .get(`/api/accounts/${accountId}/series/`)
      .then(checkStatusAxios)
      .then((series) =>
        series.map((raw: AccountSeriesResponse) => {
          return {
            label: raw.label,
            value: parseFloat(raw.value),
          };
         })
      ),
    { enabled: !!accountId }
  );
}
