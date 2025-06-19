import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { series_from_json } from "../data/PaymentSeries";
import { useAxios } from "./AxiosContext";

export default function usePaymentSeries() {
  const axios = useAxios();
  const fetchPayments = () =>
    axios.get("/api/payments/")
      .then(checkStatusAxios)
      .then((series) => {
        const paymentMap = {};
        series.forEach((series) => {
          paymentMap[series.id] = series_from_json(series);
        });
        return paymentMap;
      });

  return useQuery("payments", fetchPayments);
}
