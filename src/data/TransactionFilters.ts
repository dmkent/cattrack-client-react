export interface PeriodFilters {
  to_date: string | null;
  from_date: string | null;
}

export interface TransactionFilters extends PeriodFilters {
  category: string | null;
  has_category: string | null;
  account: string | null;
}

export interface PaginatedTransactionFilters extends TransactionFilters {
  page: number;
  page_size: number;
}
