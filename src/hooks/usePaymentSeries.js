import { useQuery } from "react-query";
import Immutable from "immutable";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { series_from_json } from "../data/PaymentSeries";
import { useAxios } from "./AxiosContext";

export default function usePaymentSeries() {
  const axios = useAxios();
  const fetchPayments = () =>
    axios.get("/api/payments/")
      .then(checkStatusAxios)
      .then((series) =>
        Immutable.Map(
          series.map((series) => [series.id, series_from_json(series)])
        )
      );

  return useQuery("payments", fetchPayments);
}
