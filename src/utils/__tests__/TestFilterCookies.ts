import Cookies from "js-cookie";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { TransactionFilters } from "../../data/TransactionFilters";
import {
  loadFiltersFromCookie,
  saveFiltersToCookie,
} from "../filterCookies";

// Mock js-cookie
vi.mock("js-cookie");

describe("filterCookies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveFiltersToCookie", () => {
    it("should save filters to cookie", () => {
      const filters: TransactionFilters = {
        category: "1",
        has_category: "True",
        account: "2",
        to_date: "2024-01-01",
        from_date: "2023-01-01",
        description: "test",
      };

      saveFiltersToCookie(filters);

      expect(Cookies.set).toHaveBeenCalledWith(
        "transactionFilters",
        JSON.stringify(filters),
        { expires: 365 },
      );
    });

    it("should save filters with null values", () => {
      const filters: TransactionFilters = {
        category: null,
        has_category: null,
        account: null,
        to_date: null,
        from_date: null,
        description: null,
      };

      saveFiltersToCookie(filters);

      expect(Cookies.set).toHaveBeenCalledWith(
        "transactionFilters",
        JSON.stringify(filters),
        { expires: 365 },
      );
    });
  });

  describe("loadFiltersFromCookie", () => {
    it("should load filters from cookie", () => {
      const filters: TransactionFilters = {
        category: "1",
        has_category: "True",
        account: "2",
        to_date: "2024-01-01",
        from_date: "2023-01-01",
        description: "test",
      };

      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(filters));

      const result = loadFiltersFromCookie();

      expect(result).toEqual(filters);
      expect(Cookies.get).toHaveBeenCalledWith("transactionFilters");
    });

    it("should return null when cookie does not exist", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      const result = loadFiltersFromCookie();

      expect(result).toBeNull();
    });

    it("should return null when cookie is malformed", () => {
      vi.mocked(Cookies.get).mockReturnValue("invalid json");

      const result = loadFiltersFromCookie();

      expect(result).toBeNull();
    });
  });
});
