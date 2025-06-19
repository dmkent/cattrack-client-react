import { useQuery } from "react-query";
import { useAxios } from "./AxiosContext";
import { checkStatusAxios } from "../client/CatTrackAPI";
import { Category } from "../data/Category";

export default function useCategories() {
  const axios = useAxios();

  const fetchCategories = () =>
    axios
      .get("/api/categories/")
      .then(checkStatusAxios) // Validate the response using checkStatusAxios
      .then((resp) => {
        return resp.map((cat: any) => {
          return {
            id: cat.id,
            name: cat.name,
            score: cat.score,
          } as Category;
        });
      });

  return useQuery("categories", fetchCategories);
}
