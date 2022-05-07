import { useQuery } from "react-query";
import { loadAccountBalanceSeries } from "../client/account";

export default function useAccountSeries(account) {
  return useQuery(["account_series", account], () => loadAccountBalanceSeries(account), {enabled: !!account});
}
