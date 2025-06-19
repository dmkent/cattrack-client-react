import { parseErrors } from "../client/ErrorParser";
import { useAxios } from "./AxiosContext";

export const useUpdatePaymentSeries = () => {
  const axios = useAxios();

  const paymentSeriesAddBillFromFile = async (idx: string, upload_file: File): Promise<Error | null> => {
    let data = new FormData();
    data.append("data_file", upload_file);
    data.append("name", idx);

    const resp = await axios.post(`/api/payments/${idx}/loadpdf/`, data, {
      headers: {
        "Content-Type": undefined,
      }
    });
    
    if (resp.status === 200) {
      // All done. Resolve to null.
      return null;
    }

    let message = "";
    if (!resp.data) {
      return new Error("No response data received.");
    } else if (typeof resp.data === "object") {
      message = parseErrors(resp.data).join("; ");
    } else {
      message = resp.data;
    }
    return new Error(message);
  }

  return {
    paymentSeriesAddBillFromFile,
  }
}