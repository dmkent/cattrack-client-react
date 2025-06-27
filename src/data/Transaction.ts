export interface Transaction {
  id: string | number;
  when: string | Date;
  description: string;
  amount: string | number;
  category: string | number;
  category_name: string;
  account: string | number;
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  total: number;
}
