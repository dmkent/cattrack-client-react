import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { CategoryGroup } from "../data/Category";
import { useAxios } from "./AxiosContext";

export function useCategoryGroups() {
  const axios = useAxios();

  const fetchCategoryGroups: () => Promise<CategoryGroup[]> = () =>
    axios
      .get("/api/category-groups/")
      .then(checkStatusAxios)
      .then((resp) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return resp.map((group: any) => {
          return {
            id: group.id,
            name: group.name,
          } as CategoryGroup;
        });
      });

  return useQuery({
    queryKey: ["categoryGroups"],
    queryFn: fetchCategoryGroups,
  });
}
