import { checkStatusAxios } from "../client/CatTrackAPI";
import {
  CrossValidateRequest,
  CrossValidateResponse,
  CrossValidateResult,
  CrossValidateSaveRequest,
  SavedModel,
} from "../data/CrossValidation";
import { useAxios } from "./AxiosContext";

export const useCrossValidation = () => {
  const axios = useAxios();

  const runCrossValidation = async (
    request: CrossValidateRequest,
  ): Promise<CrossValidateResult> => {
    const response = await axios.post(
      "/api/categorisor/cross_validate/",
      request,
    );
    const data: CrossValidateResponse = checkStatusAxios(response);
    if (data.status === "error") {
      throw new Error(data.message);
    }
    return data;
  };

  const saveModel = async (
    request: CrossValidateSaveRequest,
  ): Promise<SavedModel> => {
    const response = await axios.post(
      "/api/categorisor/cross_validate_save/",
      request,
    );
    return checkStatusAxios(response);
  };

  const setDefaultModel = async (modelId: number): Promise<void> => {
    const response = await axios.post(
      `/api/categorisor/${modelId}/set_default/`,
      {},
    );
    checkStatusAxios(response);
  };

  return {
    runCrossValidation,
    saveModel,
    setDefaultModel,
  };
};
