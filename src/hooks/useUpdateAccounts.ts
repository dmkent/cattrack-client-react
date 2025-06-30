import { checkStatusAxios } from "../client/CatTrackAPI";
import { parseErrors } from "../client/ErrorParser";
import { Account } from "../data/Account";
import { useAxios } from "./AxiosContext";

export const useUpdateAccounts = () => {
  const axios = useAxios();

  const uploadFileToAccount = async (
    account: Account,
    uploadFile: File,
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("accountId", account.id);

    try {
      const response = await axios.post(
        `/api/accounts/${account.id}/load/`,
        formData,
        {
          headers: {
            "Content-Type": null, // Let the browser set the content type for multipart/form-data
          },
        },
      );
      if (response.status === 200) {
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
      if (response.status === 201) {
        return response.data as Account;
      }

      const result = await checkStatusAxios(response);

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
