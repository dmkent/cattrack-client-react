import { useQuery } from "@tanstack/react-query";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { series_from_json, PaymentSeriesItem } from "../data/PaymentSeries";
import { useAxios } from "./AxiosContext";

export default function usePaymentSeries() {
  const axios = useAxios();
  const fetchPayments = (): Promise<PaymentSeriesItem[]> =>
    axios
      .get("/api/payments/")
      .then(checkStatusAxios)
      .then((series: any[]) => {
        return series.map((seriesData) => series_from_json(seriesData));
      });

  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });
}
