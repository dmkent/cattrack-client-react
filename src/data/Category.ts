export interface Category {
  id: string;
  name: string;
  score: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
}

export interface BudgetSummary {
  id: string;
  name: string;
  value: number;
  budget: number;
}
