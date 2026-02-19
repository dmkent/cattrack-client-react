import Cookies from "js-cookie";

import { TransactionFilters } from "../data/TransactionFilters";

const COOKIE_NAME = "transactionFilters";
const COOKIE_EXPIRES = 365; // days

export function saveFiltersToCookie(filters: TransactionFilters): void {
  Cookies.set(COOKIE_NAME, JSON.stringify(filters), { expires: COOKIE_EXPIRES });
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
