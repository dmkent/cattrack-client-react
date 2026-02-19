export interface PeriodFilters {
  to_date: string | null;
  from_date: string | null;
}

export interface TransactionFilters extends PeriodFilters {
  category: string | null;
  has_category: string | null;
  account: string | null;
  description: string | null;
}

export interface PaginatedTransactionFilters extends TransactionFilters {
  page: number;
  page_size: number;
}

export function createDefaultPeriodFilters(): PeriodFilters {
  return {
    to_date: null,
    from_date: null,
  };
}

export function createDefaultTransactionFilters(): TransactionFilters {
  return {
    ...createDefaultPeriodFilters(),
    category: null,
    has_category: null,
    account: null,
    description: null,
  };
}
