import { useQuery } from "react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { series_from_json, PaymentSeries } from "../data/PaymentSeries";
import { useAxios } from "./AxiosContext";

export default function usePaymentSeries() {
  const axios = useAxios();
  const fetchPayments = (): Promise<Record<string, PaymentSeries>> =>
    axios.get("/api/payments/")
      .then(checkStatusAxios)
      .then((series: any[]) => {
        const paymentMap: Record<string, PaymentSeries> = {};
        series.forEach((seriesData) => {
          paymentMap[seriesData.id] = series_from_json(seriesData);
        });
        return paymentMap;
      });

  return useQuery("payments", fetchPayments);
}