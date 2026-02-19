import Cookies from "js-cookie";

import {
  PeriodFilters,
  TransactionFilters,
  createDefaultTransactionFilters,
} from "../data/TransactionFilters";

const COOKIE_NAME = "transactionFilters";
const COOKIE_EXPIRES = 365; // days

export function saveFiltersToCookie(filters: TransactionFilters): void {
  Cookies.set(COOKIE_NAME, JSON.stringify(filters), {
    expires: COOKIE_EXPIRES,
  });
}

export function loadFiltersFromCookie(): TransactionFilters | null {
  const cookieValue = Cookies.get(COOKIE_NAME);
  if (!cookieValue) {
    return null;
  }
  try {
    return JSON.parse(cookieValue) as TransactionFilters;
  } catch {
    // If cookie is malformed, return null
    return null;
  }
}

export function loadPeriodFiltersFromCookie(): PeriodFilters | null {
  const filters = loadFiltersFromCookie();
  if (!filters) {
    return null;
  }
  return {
    from_date: filters.from_date,
    to_date: filters.to_date,
  };
}

export function savePeriodFiltersToCookie(filters: PeriodFilters): void {
  const existingFilters =
    loadFiltersFromCookie() ?? createDefaultTransactionFilters();
  const mergedFilters: TransactionFilters = {
    ...existingFilters,
    from_date: filters.from_date,
    to_date: filters.to_date,
  };
  saveFiltersToCookie(mergedFilters);
}
