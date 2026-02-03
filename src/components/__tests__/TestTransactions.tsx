import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect, test, vi } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Account } from "../../data/Account";
import { Category } from "../../data/Category";
import { Period } from "../../data/Period";
import { Transaction } from "../../data/Transaction";
import { Transactions } from "../Transactions";

const periods: Period[] = [
  {
    id: "4",
    label: "Last month",
    from_date: "2011-01-02",
    to_date: "2011-02-02",
    offset: "1",
  },
  {
    id: "1",
    label: "Last week",
    from_date: "2011-01-24",
    to_date: "2011-02-02",
    offset: "1",
  },
];

const accounts: Account[] = [
  {
    id: "0",
    name: "account 1",
    balance: 1000,
    last_transaction: null,
  },
  {
    id: "1",
    name: "account 2",
    balance: 500,
    last_transaction: null,
  },
];

const categories: Category[] = [
  { id: "0", name: "Cat1", score: 0.5 },
  { id: "3", name: "Cat2", score: 0.8 },
];

function setup(mockAdapter: AxiosMockAdapter, transactions: Transaction[]) {
  mockAdapter.onGet("/api/periods/").reply(200, periods);
  mockAdapter.onGet("/api/accounts/").reply(200, accounts);
  mockAdapter.onGet("/api/categories/").reply(200, categories);
  mockAdapter.onGet("/api/transactions/?page=1&page_size=20").reply(200, {
    results: transactions,
    count: 40,
  });
}

test("should render self and subcomponents", async () => {
  const props = {
    page_size: 20,
  };
  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) =>
    setup(mockAdapter, []),
  );
  await waitFor(() => screen.getByText("Transactions"));

  expect(screen.getByRole("table")).toBeTruthy();
});

test("should display some transactions", async () => {
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test this",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
    {
      id: "1",
      when: new Date("2017-01-02"),
      description:
        "Test this really,  really,  really,  really,  really,  really long description",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];
  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) =>
    setup(mockAdapter, transactions),
  );
  await waitFor(() => screen.getByText("Transactions"));

  expect(screen.getByRole("table").children.length).toBeTruthy();

  expect(screen.getByText("01/01/2017")).toBeTruthy();
  expect(screen.getByText("Test this")).toBeTruthy();

  expect(screen.getByText(/Test this really, +really/)).toHaveTextContent(
    "Test this really, really, really, really, real...",
  );
});
test("should display category badges as clickable elements", async () => {
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];
  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) =>
    setup(mockAdapter, transactions),
  );
  await waitFor(() => screen.getByText("Transactions"));

  const table = screen.getByRole("table");
  const categoryBadge = within(table).getByText("Cat1");
  expect(categoryBadge).toBeTruthy();
  expect(categoryBadge).toHaveClass("badge");
  expect(categoryBadge).toHaveAttribute("role", "button");
});

test("should show category dropdown when badge is clicked", async () => {
  const user = userEvent.setup();
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];
  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) =>
    setup(mockAdapter, transactions),
  );
  await waitFor(() => screen.getByText("Transactions"));

  const table = screen.getByRole("table");
  const categoryBadge = within(table).getByText("Cat1");
  await user.click(categoryBadge);

  // Should show a select dropdown with all categories
  const select = screen.getByRole("combobox");
  expect(select).toBeTruthy();
  expect(within(select).getByText("Cat1")).toBeTruthy();
  expect(within(select).getByText("Cat2")).toBeTruthy();
});

test("should update category when new category is selected", async () => {
  const user = userEvent.setup();
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];

  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/periods/").reply(200, periods);
    mockAdapter.onGet("/api/accounts/").reply(200, accounts);
    mockAdapter.onGet("/api/categories/").reply(200, categories);

    // Initial load - return Cat1
    mockAdapter.onGet("/api/transactions/?page=1&page_size=20").replyOnce(200, {
      results: transactions,
      count: 1,
    });

    // Mock the update endpoint
    mockAdapter.onPut("/api/transactions/0/").reply(200, {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "3",
      account: "0",
      category_name: "Cat2",
    });

    // After update - return Cat2
    mockAdapter.onGet("/api/transactions/?page=1&page_size=20").reply(200, {
      results: [
        {
          id: "0",
          when: new Date("2017-01-01"),
          description: "Test transaction",
          amount: -90.9,
          category: "3",
          account: "0",
          category_name: "Cat2",
        },
      ],
      count: 1,
    });
  });

  await waitFor(() => screen.getByText("Transactions"));

  const table = screen.getByRole("table");
  const categoryBadge = within(table).getByText("Cat1");
  await user.click(categoryBadge);

  const select = screen.getByRole("combobox");
  await user.selectOptions(select, "3");

  // The dropdown should close and the updated category should be displayed
  await waitFor(() => {
    expect(screen.queryByRole("combobox")).toBeFalsy();
  });

  // Verify the updated category is now displayed in the table
  await waitFor(() => {
    const updatedTable = screen.getByRole("table");
    expect(within(updatedTable).getByText("Cat2")).toBeTruthy();
  });
});

test("should close dropdown on blur without saving", async () => {
  const user = userEvent.setup();
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];
  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) =>
    setup(mockAdapter, transactions),
  );
  await waitFor(() => screen.getByText("Transactions"));

  const table = screen.getByRole("table");
  const categoryBadge = within(table).getByText("Cat1");
  await user.click(categoryBadge);

  const select = screen.getByRole("combobox");
  expect(select).toBeTruthy();

  // Click outside / blur
  await user.tab();

  // Dropdown should close
  await waitFor(() => {
    expect(screen.queryByRole("combobox")).toBeFalsy();
  });

  // Original badge should still be visible in the table
  const tableAfter = screen.getByRole("table");
  expect(within(tableAfter).getByText("Cat1")).toBeTruthy();
});

test("should not update when same category is selected", async () => {
  const user = userEvent.setup();
  const props = {
    page_size: 20,
  };
  const transactions: Transaction[] = [
    {
      id: "0",
      when: new Date("2017-01-01"),
      description: "Test transaction",
      amount: -90.9,
      category: "0",
      account: "0",
      category_name: "Cat1",
    },
  ];

  const updateSpy = vi.fn();

  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) => {
    setup(mockAdapter, transactions);
    // Track if update endpoint is called
    mockAdapter.onPut("/api/transactions/0/").reply(() => {
      updateSpy();
      return [200, transactions[0]];
    });
  });

  await waitFor(() => screen.getByText("Transactions"));

  const categoryBadge = screen.getByText("Cat1");
  await user.click(categoryBadge);

  const select = screen.getByRole("combobox");
  // Select the same category (Cat1 has id "0")
  await user.selectOptions(select, "0");

  // Dropdown should close without calling update
  await waitFor(() => {
    expect(screen.queryByRole("combobox")).toBeFalsy();
  });

  expect(updateSpy).not.toHaveBeenCalled();
});

test("should scroll to top when page changes", async () => {
  const user = userEvent.setup();
  const scrollToMock = vi.fn();
  window.scrollTo = scrollToMock;

  const props = {
    page_size: 20,
  };
  const page1Transactions: Transaction[] = Array.from(
    { length: 20 },
    (_, i) => ({
      id: String(i),
      when: new Date("2017-01-01"),
      description: `Transaction ${i}`,
      amount: -10.0,
      category: "0",
      account: "0",
      category_name: "Cat1",
    }),
  );

  const page2Transactions: Transaction[] = Array.from(
    { length: 20 },
    (_, i) => ({
      id: String(i + 20),
      when: new Date("2017-01-02"),
      description: `Transaction ${i + 20}`,
      amount: -15.0,
      category: "0",
      account: "0",
      category_name: "Cat1",
    }),
  );

  renderWithProviders(<Transactions {...props} />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/periods/").reply(200, periods);
    mockAdapter.onGet("/api/accounts/").reply(200, accounts);
    mockAdapter.onGet("/api/categories/").reply(200, categories);
    mockAdapter.onGet("/api/transactions/?page=1&page_size=20").reply(200, {
      results: page1Transactions,
      count: 40, // 2 pages worth of data
    });
    mockAdapter.onGet("/api/transactions/?page=2&page_size=20").reply(200, {
      results: page2Transactions,
      count: 40,
    });
  });

  await waitFor(() => screen.getByText("Transactions"));

  // Find and click the next page button
  const nextButton = screen.getByText("›");
  await user.click(nextButton);

  // Verify scrollTo was called with correct parameters
  await waitFor(() => {
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
