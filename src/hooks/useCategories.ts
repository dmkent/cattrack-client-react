import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { Category } from "../data/Category";
import { useAxios } from "./AxiosContext";

export function useCategories() {
  const axios = useAxios();

  const fetchCategories = () =>
    axios
      .get("/api/categories/")
      .then(checkStatusAxios) // Validate the response using checkStatusAxios
      .then((resp) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return resp.map((cat: any) => {
          return {
            id: cat.id,
            name: cat.name,
            score: cat.score,
          } as Category;
        });
      });

  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}
