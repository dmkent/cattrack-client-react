import { useQueryClient } from "@tanstack/react-query";

import { checkStatusAxios } from "../client/CatTrackAPI";
import { Budget, BudgetInput } from "../data/Budget";
import { useAxios } from "./AxiosContext";

export const useUpdateBudgets = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["budgets"] });

  const createBudget = async (input: BudgetInput): Promise<Budget> => {
    const response = await axios.post("/api/budget/", input);
    const result = await checkStatusAxios(response);
    await invalidate();
    return result as Budget;
  };

  const updateBudget = async (
    id: number,
    input: BudgetInput,
  ): Promise<Budget> => {
    const response = await axios.put(`/api/budget/${id}/`, input);
    const result = await checkStatusAxios(response);
    await invalidate();
    return result as Budget;
  };

  const deleteBudget = async (id: number): Promise<void> => {
    const response = await axios.delete(`/api/budget/${id}/`);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Failed to delete budget (status ${response.status})`);
    }
    await invalidate();
  };

  return { createBudget, updateBudget, deleteBudget };
};
