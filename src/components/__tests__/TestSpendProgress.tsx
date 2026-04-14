import { screen, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { ProgressResponse } from "../../data/Progress";
import { SpendProgress } from "../SpendProgress";

const periods = [
  {
    id: 4,
    label: "Last month",
    from_date: "2026-03-01",
    to_date: "2026-03-31",
    offset: "1",
  },
  {
    id: 1,
    label: "Last week",
    from_date: "2026-04-07",
    to_date: "2026-04-14",
    offset: "1",
  },
];

const progressResponse: ProgressResponse = {
  period: {
    from_date: "2026-03-01",
    to_date: "2026-03-31",
    label: "This month",
  },
  rows: [
    {
      id: 5,
      name: "Groceries",
      actual_spend: "-342.50",
      expected_remaining: "-157.50",
      budget: "-500.00",
      upcoming_bills: [],
    },
    {
      id: 8,
      name: "Utilities",
      actual_spend: "-89.00",
      expected_remaining: "-45.00",
      budget: "-150.00",
      upcoming_bills: [
        {
          name: "Electricity",
          expected_date: "2026-04-15",
          expected_amount: "120.00",
        },
      ],
    },
    {
      id: 12,
      name: "Entertainment",
      actual_spend: "-50.00",
      expected_remaining: "-30.00",
      budget: null,
      upcoming_bills: [],
    },
  ],
  totals: {
    actual_spend: "-481.50",
    expected_remaining: "-232.50",
    budget: "-650.00",
  },
};

beforeEach(() => {
  Cookies.set(
    "transactionFilters",
    JSON.stringify({
      from_date: "2026-03-01",
      to_date: "2026-03-31",
      category: null,
      has_category: null,
      account: null,
      description: null,
    }),
  );
});

afterEach(() => {
  Cookies.remove("transactionFilters");
});

function renderSpendProgress() {
  return renderWithProviders(
    <SpendProgress />,
    undefined,
    (mockAdapter) => {
      mockAdapter.onGet("/api/periods/").reply(200, periods);
      mockAdapter.onGet("/api/progress/").reply(200, progressResponse);
    },
  );
}

test("renders progress table with category rows", async () => {
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  expect(screen.getByText("Utilities")).toBeInTheDocument();
  expect(screen.getByText("Entertainment")).toBeInTheDocument();
  expect(screen.getByText("This month")).toBeInTheDocument();
});

test("renders period selector buttons", async () => {
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  expect(screen.getByRole("button", { name: "Last month" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Last week" })).toBeTruthy();
});

test("renders group by toggle buttons", async () => {
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  expect(
    screen.getByRole("button", { name: "By Category" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "By Group" }),
  ).toBeInTheDocument();
});

test("shows No budget for rows without budget", async () => {
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Entertainment")).toBeInTheDocument();
  });

  expect(screen.getByText("No budget")).toBeInTheDocument();
});

test("renders totals row", async () => {
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});

test("expands row to show upcoming bills", async () => {
  const user = userEvent.setup();
  renderSpendProgress();

  await waitFor(() => {
    expect(screen.getByText("Utilities")).toBeInTheDocument();
  });

  // Electricity bill should not be visible initially
  expect(screen.queryByText("Electricity")).not.toBeInTheDocument();

  // Click the expand chevron on the Utilities row
  const utilitiesRow = screen.getByText("Utilities").closest("tr")!;
  const expandCell = utilitiesRow.querySelector("td:first-child")!;
  await user.click(expandCell);

  await waitFor(() => {
    expect(screen.getByText("Electricity")).toBeInTheDocument();
  });

  expect(screen.getByText("2026-04-15")).toBeInTheDocument();
});
