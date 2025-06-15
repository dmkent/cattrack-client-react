import { parseErrors } from '../client/ErrorParser';
import { useAxios } from './AxiosContext';
import { checkStatusAxios } from '../client/CatTrackAPI';

import Account from "../data/Account";

export const useUpdateAccounts = () => {
  const axios = useAxios();

  const uploadFileToAccount = async (account: any, uploadFile: File) => {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('accountId', account.id);
    
    try {
      const response = await axios.post(`/api/accounts/${account.id}/load/`, formData, {
        headers: {
          'Content-Type': null, // Let the browser set the content type for multipart/form-data
        }
      });
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
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  const createAccount = async (name: string) => {
    try {
      const response = await axios.post('/api/accounts/', { name });
      if (response.status === 201) {
        return response.data;
      }

      const result = await checkStatusAxios(response);

      return new Account(result)
      throw new Error('Failed to create account');
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  return {
    uploadFileToAccount,
    createAccount
  }
}