import { useQueryClient } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { parseErrors } from "../client/ErrorParser";
import { Account } from "../data/Account";
import { useAxios } from "./AxiosContext";

export const useUpdateAccounts = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const uploadFileToAccount = async (
    account: Account,
    uploadFile: File,
    fromDate: string | null = null,
    toDate: string | null = null,
    onProgress?: (progress: number) => void,
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("data_file", uploadFile);
    formData.append("accountId", account.id);
    if (fromDate) {
      formData.append("from_date", fromDate);
    }
    if (toDate) {
      formData.append("to_date", toDate);
    }

    try {
      const response = await axios.post(
        `/api/accounts/${account.id}/load/`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              onProgress(percentage);
            }
          },
        },
      );
      if (response.status === 200) {
        await queryClient.invalidateQueries({
          queryKey: ["account_series", account.id],
        });

        return;
      }

      let message = "";
      if (response.data === null) {
        return;
      } else if (response.data instanceof Object) {
        message = parseErrors(response.data).join(", ");
      } else {
        message = response.data;
      }
      return Promise.reject(new Error(message));
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const createAccount = async (name: string): Promise<Account> => {
    try {
      const response = await axios.post("/api/accounts/", { name });
      const result = await checkStatusAxios(response);

      await queryClient.invalidateQueries({ queryKey: ["accounts"] });

      return {
        ...result,
      } as Account;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  return {
    uploadFileToAccount,
    createAccount,
  };
};
