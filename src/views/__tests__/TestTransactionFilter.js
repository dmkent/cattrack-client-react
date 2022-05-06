import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";

import TransactionFilter from "../TransactionFilter";
import authService from "../../services/auth.service";

const periods = [
  {
    id: 4,
    label: "Last month",
    from_date: "2011-01-02",
    to_date: "2011-02-02",
    offset: "1",
  },
  {
    id: 1,
    label: "Last week",
    from_date: "2011-01-24",
    to_date: "2011-02-02",
    offset: "1",
  },
];
const accounts = [
  { id: 0, name: "account 1" },
  { id: 1, name: "account 2" },
];
const categories = [
  { id: 0, name: "Cat1" },
  { id: 3, name: "Cat2" },
];
const filters = { to_date: null, from_date: null, category: 3, account: 0 };

function setup() {
  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/periods/").reply(200, periods);
  nock("http://localhost:8000").get("/api/accounts/").reply(200, accounts);
  nock("http://localhost:8000").get("/api/categories/").reply(200, categories);
}

test("TestTransactionFilter should render self and subcomponents", async () => {
  const props = {
    setFilters: jest.fn(),
    filters: filters,
  };

  setup();
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionFilter {...props} />
    </QueryClientProvider>
  );

  await waitFor(() => screen.getByText("Time"));

  expect(screen.getByText("Time")).toBeTruthy();
});

test("should display some categories and accounts", async () => {
  const props = {
    setFilters: jest.fn(),
    filters: filters,
  };

  setup();
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionFilter {...props} />
    </QueryClientProvider>
  );

  await waitFor(() => screen.getByText("Time"));

  expect(screen.getByRole("button", { name: "Cat1" })).not.toHaveClass(
    "active"
  );
  expect(screen.getByRole("button", { name: "Cat2" })).toHaveClass("active");

  fireEvent.click(screen.getByRole("button", { name: "Cat1" }));
  expect(props.setFilters.mock.calls.length).toBe(1);

  // Click on account
  fireEvent.click(screen.getByRole("button", { name: "account 1" }));
  expect(props.setFilters.mock.calls.length).toBe(2);
});

test("should display some periods and set active", async () => {
  const props = {
    setFilters: jest.fn(),
    filters: filters,
  };

  setup();
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionFilter {...props} />
    </QueryClientProvider>
  );

  await waitFor(() => screen.getByText("Time"));

  expect(screen.getByRole("button", { name: "Cat1" })).not.toHaveClass(
    "active"
  );
  expect(screen.getByRole("button", { name: "Cat2" })).toHaveClass("active");

  // Reset to "All"
  fireEvent.click(screen.getByTestId("cat-all"));
  expect(props.setFilters.mock.calls.length).toBe(1);
  expect(props.setFilters.mock.calls[0][0]).toEqual({
    account: 0,
    category: null,
    has_category: null,
    from_date: null,
    to_date: null,
  });

  // Reset account to "All"
  fireEvent.click(screen.getByTestId("acct-all"));
  expect(props.setFilters.mock.calls.length).toBe(2);
  expect(props.setFilters.mock.calls[1][0]).toEqual({
    account: null,
    category: 3,
    from_date: null,
    to_date: null,
  });
});
