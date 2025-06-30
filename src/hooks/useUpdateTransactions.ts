import { checkStatusAxios } from "../client/CatTrackAPI";
import { Transaction } from "../data/Transaction";
import { useAxios } from "./AxiosContext";

interface Split {
  category: string;
  amount: string | number;
}

export const useUpdateTransactions = () => {
  const axios = useAxios();

  const updateTransactionSplits = async (
    transaction: Transaction,
    splits: Map<number, Split> | null,
    onDone: () => void,
  ) => {
    let updated = { ...transaction };
    if (splits !== null && splits.size === 1) {
      const firstSplit = splits.get(0);
      if (firstSplit) {
        updated = { ...updated, category: firstSplit.category };
      }
    }

    const updateResponse = await axios.put(
      `/api/transactions/${updated.id}/`,
      updated,
    );

    await checkStatusAxios(updateResponse);

    if (splits !== null && splits.size > 1) {
      const splitsArray = Array.from(splits.values());
      const splitsResponse = await axios.post(
        `/api/transactions/${updated.id}/split/`,
        splitsArray,
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
