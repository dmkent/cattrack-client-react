import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { SavedModel } from "../data/CrossValidation";
import { useAxios } from "./AxiosContext";

export function useCategorisorList() {
  const axios = useAxios();

  return useQuery<SavedModel[]>({
    queryKey: ["categorisors"],
    queryFn: () =>
      axios
        .get("/api/categorisor/")
        .then(checkStatusAxios)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => data.results as SavedModel[]),
  });
}
