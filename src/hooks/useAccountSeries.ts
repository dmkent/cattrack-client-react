import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { SeriesPoint } from "../data/Account";
import { useAxios } from "./AxiosContext";

interface AccountSeriesResponse {
  label: string;
  value: string;
}

export default function useAccountSeries(accountId: string | undefined) {
  const axios = useAxios();

  return useQuery<SeriesPoint[]>({
    queryKey: ["account_series", accountId],
    queryFn: () =>
      axios
        .get(`/api/accounts/${accountId}/series/`)
        .then(checkStatusAxios)
        .then((series) =>
          series.map((raw: AccountSeriesResponse) => {
            return {
              label: raw.label,
              value: parseFloat(raw.value),
            };
          }),
        ),
    enabled: !!accountId,
  });
}
