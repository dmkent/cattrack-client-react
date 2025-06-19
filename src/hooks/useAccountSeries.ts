import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { Account } from "../data/Account";

export default function useAccountSeries(account: Account) {
  const axios = useAxios();
  return useQuery(
    ["account_series", account],
    () => axios
      .get(`/api/accounts/${account.id}/series/`)
      .then(checkStatusAxios)
      .then((series) =>
        series.map((raw: any) => {
          return {...raw};
         })
      ),
    { enabled: !!account }
  );
}
