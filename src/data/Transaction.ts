export interface Transaction {
  id: string;
  when: Date;
  description: string;
  amount: number;
  category: string;
  category_name: string;
  account: string;
}

export interface CategorySummary {
  category_id: string;
  category_name: string;
  subcategory: string;
  total: number;
}

export interface Split {
  category: string;
  amount: string | number;
}
