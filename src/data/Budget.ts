export interface Budget {
  url: string;
  id: number;
  pretty_name: string;
  amount: string;
  valid_from: string;
  valid_to: string;
  categories: string[];
}

export interface BudgetInput {
  amount: string;
  valid_from: string;
  valid_to: string;
  categories: string[];
}

export function categoryIdFromUrl(url: string): number | null {
  const match = url.match(/\/categories\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : null;
}
