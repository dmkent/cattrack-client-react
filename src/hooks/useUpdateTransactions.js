import { checkStatusAxios } from "../client/CatTrackAPI";
import { useAxios } from "./AxiosContext";

export const useUpdateTransactions = () => {
  const axios = useAxios();

  const updateTransactionSplits = async (transaction, splits, onDone) => {
    let updated = transaction;
    if (splits !== null && splits.size === 1) {
      let new_category = splits.get(0).category;
      updated = updated.set("category", new_category);
    }

    const updateResponse = await axios.put(`/api/transactions/${updated.id}/`, updated);

    await checkStatusAxios(updateResponse);
    
    if (splits !== null && splits.size > 1) {
      const splitsResponse = await axios.post(`/api/transactions/${updated.id}/split/`, splits);
      await checkStatusAxios(splitsResponse);
      onDone();
    } else {
      onDone();
    }
  }

  return {
    updateTransactionSplits,
  };
}
