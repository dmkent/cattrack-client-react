import { checkStatusAxios } from "../client/CatTrackAPI";
import { Split, Transaction } from "../data/Transaction";
import { useAxios } from "./AxiosContext";

export const useUpdateTransactions = () => {
  const axios = useAxios();

  const updateTransactionSplits = async (
    transaction: Transaction,
    splits: Split[] | null,
    onDone: () => void,
  ) => {
    let updated = { ...transaction };
    if (splits !== null && splits.length === 1) {
      const firstSplit = splits[0];
      if (firstSplit) {
        updated = { ...updated, category: firstSplit.category };
      }
    }

    const updateResponse = await axios.put(
      `/api/transactions/${updated.id}/`,
      updated,
    );

    await checkStatusAxios(updateResponse);

    if (splits !== null && splits.length > 1) {
      const splitsResponse = await axios.post(
        `/api/transactions/${updated.id}/split/`,
        splits,
      );
      await checkStatusAxios(splitsResponse);
      onDone();
    } else {
      onDone();
    }
  };

  return {
    updateTransactionSplits,
  };
};
