import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { expect, test } from "vitest";

import { CategorySummary } from "../../data/Transaction";
import { PeriodFilters } from "../../data/TransactionFilters";
import { CategoryAveragesTable } from "../CategoryAveragesTable";

function setup(summary: CategorySummary[], filters: PeriodFilters) {
  const props = {
    summary: summary,
    filters: filters,
  };

  render(
    <IntlProvider locale="en">
      <CategoryAveragesTable {...props} />
    </IntlProvider>,
  );

  return {
    props,
  };
}

test("CategoryAveragesTable should render with categories and time periods", () => {
  const summary: CategorySummary[] = [
    { category_id: "1", category_name: "Groceries", total: -100 },
    { category_id: "2", category_name: "Transport", total: -50 },
  ];
  const filters: PeriodFilters = {
    from_date: "2024-01-01",
    to_date: "2024-01-31",
  };

  setup(summary, filters);

  expect(screen.getByTestId("category-averages-table")).toBeTruthy();
  expect(screen.getByText("Groceries")).toBeTruthy();
  expect(screen.getByText("Transport")).toBeTruthy();
  expect(screen.getByText("Annual")).toBeTruthy();
  expect(screen.getByText("Monthly")).toBeTruthy();
  expect(screen.getByText("Fortnightly")).toBeTruthy();
  expect(screen.getByText("Weekly")).toBeTruthy();
});

test("CategoryAveragesTable should filter out income", () => {
  const summary: CategorySummary[] = [
    { category_id: "1", category_name: "Groceries", total: -100 },
    { category_id: "2", category_name: "Salary", total: 2000 },
  ];
  const filters: PeriodFilters = {
    from_date: "2024-01-01",
    to_date: "2024-01-31",
  };

  setup(summary, filters);

  expect(screen.getByText("Groceries")).toBeTruthy();
  expect(screen.queryByText("Salary")).toBeNull();
});
