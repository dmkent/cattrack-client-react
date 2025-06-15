import { useQuery } from "react-query";
import Immutable from "immutable";
import { fetch_from_api, checkStatus } from "../client/CatTrackAPI";
import { useAuth } from "./AuthContext";
import { series_from_json } from "../data/PaymentSeries";

export default function usePaymentSeries() {
  const auth = useAuth();
  const fetchPayments = () =>
    fetch_from_api("/api/payments/", {}, auth.user?.token)
      .then(checkStatus)
      .then((series) =>
        Immutable.Map(
          series.map((series) => [series.id, series_from_json(series)])
        )
      );

  return useQuery("payments", fetchPayments);
}
