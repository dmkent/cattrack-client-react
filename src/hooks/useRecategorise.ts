import { useQuery, useQueryClient } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { SavedModel } from "../data/CrossValidation";
import {
  RecategoriseApplyResponse,
  RecategorisePreviewItem,
  RecategorisePreviewResponse,
  RecategoriseUpdate,
} from "../data/Recategorise";
import { useAxios } from "./AxiosContext";

export function useCategorisorModels() {
  const axios = useAxios();

  const fetchModels: () => Promise<SavedModel[]> = () =>
    axios
      .get("/api/categorisor/")
      .then(checkStatusAxios)
      .then((resp) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resp.map((model: any) => ({
          url: model.url,
          id: model.id,
          name: model.name,
          implementation: model.implementation,
          from_date: model.from_date,
          to_date: model.to_date,
        })),
      );

  return useQuery({
    queryKey: ["categorisor-models"],
    queryFn: fetchModels,
  });
}

export function useRecategorisePreview(
  modelId: number | null,
  fromDate: string,
  toDate: string,
  page: number,
) {
  const axios = useAxios();

  const fetchPreview: () => Promise<{
    count: number;
    results: RecategorisePreviewItem[];
  }> = () =>
    axios
      .get(
        `/api/categorisor/${modelId}/preview_recategorize/?from_date=${fromDate}&to_date=${toDate}&page=${page}&page_size=100`,
      )
      .then(checkStatusAxios)
      .then((data: RecategorisePreviewResponse) => ({
        count: data.count,
        results: data.results,
      }));

  return useQuery({
    queryKey: ["recategorise-preview", modelId, fromDate, toDate, page],
    queryFn: fetchPreview,
    enabled: modelId !== null && fromDate !== "" && toDate !== "",
    placeholderData: (previousData) => previousData,
  });
}

export function useApplyRecategorise() {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const applyRecategorise = async (
    modelId: number,
    updates: RecategoriseUpdate[],
  ): Promise<RecategoriseApplyResponse> => {
    const response = await axios.post(
      `/api/categorisor/${modelId}/apply_recategorize/`,
      { updates },
    );
    const data: RecategoriseApplyResponse = checkStatusAxios(response);
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["recategorise-preview"] });
    return data;
  };

  return { applyRecategorise };
}
