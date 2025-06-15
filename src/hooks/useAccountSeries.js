import { useQuery } from "react-query";
import { useAuth } from "./AuthContext";
import { loadAccountBalanceSeries } from "../client/account";

export default function useAccountSeries(account) {
  const auth = useAuth();
  return useQuery(
    ["account_series", account],
    () => loadAccountBalanceSeries(account, auth.user?.token),
    { enabled: !!account }
  );
}
