import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";

export default function useAccountSeries(account) {
  const axios = useAxios();
  return useQuery(
    ["account_series", account],
    () => axios
      .get(`/api/accounts/${account.id}/series/`)
      .then(checkStatusAxios)
      .then((series) =>
        series.map((raw) => {
          return {...raw};
         })
      ),
    { enabled: !!account }
  );
}
