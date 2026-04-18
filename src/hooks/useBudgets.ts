import { useQuery } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { Budget } from "../data/Budget";
import { useAxios } from "./AxiosContext";

export function useBudgets() {
  const axios = useAxios();

  const fetchBudgets = (): Promise<Budget[]> =>
    axios
      .get("/api/budget/")
      .then(checkStatusAxios)
      .then((raw) => raw as Budget[]);

  return useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });
}
