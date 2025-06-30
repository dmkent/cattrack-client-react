import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { series_from_json, PaymentSeriesItem } from "../data/PaymentSeries";
import { useAxios } from "./AxiosContext";

export function usePaymentSeries() {
  const axios = useAxios();
  const fetchPayments = (): Promise<PaymentSeriesItem[]> =>
    axios
      .get("/api/payments/")
      .then(checkStatusAxios)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((series: any[]) => {
        return series.map((seriesData) => series_from_json(seriesData));
      });

  return useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });
}
