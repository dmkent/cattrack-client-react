import { render, screen, within } from "@testing-library/react";
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
  // "Total" appears both as a column header and the grand-total row label.
  expect(screen.getAllByText("Total").length).toBeGreaterThan(1);
});

test("CategoryAveragesTable shows raw total and extrapolated period rates", () => {
  // 100 days in the period, $1000 total -> $10/day mean daily amount.
  const summary: CategorySummary[] = [
    {
      category_id: "1",
      category_name: "Consulting fees",
      subcategory: "Consulting",
      total: 1000,
    },
  ];
  const filters: PeriodFilters = {
    from_date: "2024-01-01",
    to_date: "2024-04-09", // inclusive -> 100 days
  };

  setup(summary, filters);

  const headerCells = within(screen.getAllByRole("row")[0]).getAllByRole(
    "columnheader",
  );
  expect(headerCells.map((cell) => cell.textContent)).toEqual([
    "Category",
    "Total",
    "Annual",
    "Monthly",
    "Fortnightly",
    "Weekly",
  ]);

  const consultingRow = screen.getByText("Consulting").closest("tr");
  // The "Consulting" group row is visible without expanding.
  expect(consultingRow).not.toBeNull();
  const cells = within(consultingRow as HTMLElement).getAllByRole("cell");

  // Total is the raw amount regardless of the period length.
  expect(cells[1].textContent).toBe("A$1,000");
  // Annual = daily (10) * 365.25 = 3652.5 -> rounds to A$3,653.
  expect(cells[2].textContent).toBe("A$3,653");
  // Monthly = annual / 12 = 304.375 -> rounds to A$304.
  expect(cells[3].textContent).toBe("A$304");
  // Fortnightly = daily * 14 = 140.
  expect(cells[4].textContent).toBe("A$140");
  // Weekly = daily * 7 = 70.
  expect(cells[5].textContent).toBe("A$70");
});
