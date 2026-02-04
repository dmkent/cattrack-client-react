import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test, vi } from "vitest";

import { Dashboard } from "../Dashboard";
import * as usePeriods from "../../hooks/usePeriods";
import * as useTransactionSummary from "../../hooks/useTransactionSummary";
import { CategorySummary } from "../../data/Transaction";
import { Period } from "../../data/Period";

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockPeriods: Period[] = [
    {
      id: "1",
      offset: "0",
      label: "This Month",
      from_date: "2024-01-01",
      to_date: "2024-01-31",
    },
  ];

  const mockSummary: CategorySummary[] = [
    { category_id: "1", category_name: "Groceries", total: -100 },
    { category_id: "2", category_name: "Transport", total: -50 },
  ];

  vi.spyOn(usePeriods, "usePeriods").mockReturnValue({
    isLoading: false,
    data: mockPeriods,
  } as any);

  vi.spyOn(useTransactionSummary, "useTransactionSummaries").mockReturnValue({
    isLoading: false,
    data: mockSummary,
  } as any);

  render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <Dashboard />
      </IntlProvider>
    </QueryClientProvider>,
  );
}

test("Dashboard should switch between plot and table views", async () => {
  const user = userEvent.setup();
  setup();

  // Initially, plot view should be shown
  expect(screen.getByTestId("plotly")).toBeTruthy();
  expect(screen.queryByTestId("category-averages-table")).toBeNull();

  // Click on Table View button
  const tableButton = screen.getByText("Table View");
  await user.click(tableButton);

  // Table should be shown, plot should be hidden
  expect(screen.getByTestId("category-averages-table")).toBeTruthy();
  expect(screen.queryByTestId("plotly")).toBeNull();

  // Click on Plot View button
  const plotButton = screen.getByText("Plot View");
  await user.click(plotButton);

  // Plot should be shown again
  expect(screen.getByTestId("plotly")).toBeTruthy();
  expect(screen.queryByTestId("category-averages-table")).toBeNull();
});
