import { parseErrors } from "../client/ErrorParser";
import { useAxios } from "./AxiosContext";

export const useUpdatePaymentSeries = () => {
  const axios = useAxios();

  const paymentSeriesAddBillFromFile = async (idx, upload_file) => {
    let data = new FormData();
    data.append("data_file", upload_file);
    data.append("name", idx);

    const resp = await axios.post(`/api/payments/${idx}/loadpdf/`, data, {
      headers: {
        "Content-Type": undefined,
      }
    });
    
    if (resp.status == 200) {
      // All done. Resolve to null.
      return;
    }

    let message = "";
    if (resp.data === null) {
      return;
    } else if (resp.data instanceof Object) {
      message = parseErrors(resp.data);
    } else {
      message = resp.data;
    }
    return new Error(message);
  }

  return {
    paymentSeriesAddBillFromFile,
  }
}
