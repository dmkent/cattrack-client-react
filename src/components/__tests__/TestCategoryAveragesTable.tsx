import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("CategoryAveragesTable groups by subcategory and toggles members", async () => {
  const summary: CategorySummary[] = [
    {
      category_id: "1",
      category_name: "Groceries - Markets",
      subcategory: "Groceries",
      total: -200,
    },
    {
      category_id: "2",
      category_name: "Groceries - Bakery",
      subcategory: "Groceries",
      total: -50,
    },
    {
      category_id: "3",
      category_name: "Fuel",
      subcategory: "Transport",
      total: -80,
    },
    {
      category_id: "4",
      category_name: "Salary",
      subcategory: "Income",
      total: 500,
    },
  ];
  const filters: PeriodFilters = {
    from_date: "2024-01-01",
    to_date: "2024-01-31",
  };

  setup(summary, filters);

  expect(screen.getByText("Groceries")).toBeTruthy();
  expect(screen.getByText("Transport")).toBeTruthy();
  expect(screen.getByText("Annual")).toBeTruthy();
  expect(screen.queryByText("Groceries - Markets")).toBeNull();

  const toggleButton = screen.getByRole("button", { name: "Toggle Groceries" });
  await userEvent.click(toggleButton);

  expect(screen.getByText("Groceries - Markets")).toBeTruthy();
  expect(screen.getByText("Groceries - Bakery")).toBeTruthy();
});

test("CategoryAveragesTable shows income before expenses with subtotals", () => {
  const summary: CategorySummary[] = [
    {
      category_id: "1",
      category_name: "Salary",
      subcategory: "Income",
      total: 3000,
    },
    {
      category_id: "2",
      category_name: "Bonus",
      subcategory: "Income",
      total: 500,
    },
    {
      category_id: "3",
      category_name: "Rent",
      subcategory: "Housing",
      total: -1200,
    },
    {
      category_id: "4",
      category_name: "Utilities",
      subcategory: "Housing",
      total: -300,
    },
  ];
  const filters: PeriodFilters = {
    from_date: "2024-02-01",
    to_date: "2024-02-29",
  };

  setup(summary, filters);

  const rows = screen.getAllByRole("row");
  const incomeLabelIndex = rows.findIndex((row) =>
    row.textContent?.includes("Income"),
  );
  const expenseLabelIndex = rows.findIndex((row) =>
    row.textContent?.includes("Expenses"),
  );

  expect(incomeLabelIndex).toBeGreaterThan(-1);
  expect(expenseLabelIndex).toBeGreaterThan(-1);
  expect(incomeLabelIndex).toBeLessThan(expenseLabelIndex);

  expect(screen.getByText("Income subtotal")).toBeTruthy();
  expect(screen.getByText("Expenses subtotal")).toBeTruthy();
  expect(screen.getByText("Total")).toBeTruthy();
});
