import Cookies from "js-cookie";
import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  PeriodFilters,
  TransactionFilters,
} from "../../data/TransactionFilters";
import {
  loadFiltersFromCookie,
  loadPeriodFiltersFromCookie,
  saveFiltersToCookie,
  savePeriodFiltersToCookie,
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

  describe("loadPeriodFiltersFromCookie", () => {
    it("should load period filters when cookie exists", () => {
      const filters: TransactionFilters = {
        category: null,
        has_category: null,
        account: null,
        to_date: "2024-02-01",
        from_date: "2024-01-01",
        description: null,
      };

      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(filters));

      const result = loadPeriodFiltersFromCookie();

      expect(result).toEqual({
        from_date: filters.from_date,
        to_date: filters.to_date,
      });
    });

    it("should return null when cookie is missing", () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      const result = loadPeriodFiltersFromCookie();

      expect(result).toBeNull();
    });
  });

  describe("savePeriodFiltersToCookie", () => {
    it("should update only period fields when cookie already exists", () => {
      const existingFilters: TransactionFilters = {
        category: "1",
        has_category: "True",
        account: "2",
        to_date: "2023-01-31",
        from_date: "2023-01-01",
        description: "keep",
      };
      const newPeriodFilters: PeriodFilters = {
        from_date: "2024-02-01",
        to_date: "2024-02-29",
      };

      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(existingFilters));

      savePeriodFiltersToCookie(newPeriodFilters);

      expect(Cookies.set).toHaveBeenCalledWith(
        "transactionFilters",
        expect.any(String),
        { expires: 365 },
      );
      const [, cookieValue] = vi.mocked(Cookies.set).mock.calls[0];
      expect(JSON.parse(cookieValue as string)).toEqual({
        ...existingFilters,
        ...newPeriodFilters,
      });
    });

    it("should create a new transaction filter cookie when missing", () => {
      const newPeriodFilters: PeriodFilters = {
        from_date: "2024-02-01",
        to_date: "2024-02-29",
      };

      vi.mocked(Cookies.get).mockReturnValue(undefined);

      savePeriodFiltersToCookie(newPeriodFilters);

      expect(Cookies.set).toHaveBeenCalledWith(
        "transactionFilters",
        expect.any(String),
        { expires: 365 },
      );
      const [, cookieValue] = vi.mocked(Cookies.set).mock.calls[0];
      expect(JSON.parse(cookieValue as string)).toEqual({
        account: null,
        category: null,
        description: null,
        from_date: newPeriodFilters.from_date,
        has_category: null,
        to_date: newPeriodFilters.to_date,
      });
    });
  });
});
