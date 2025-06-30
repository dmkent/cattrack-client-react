import { screen, waitFor } from "@testing-library/react";
import AxiosMockAdapter from "axios-mock-adapter";
import React from "react";
import { expect, test } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Account } from "../../data/Account";
import { Category } from "../../data/Category";
import { Period } from "../../data/Period";
import { Transaction } from "../../data/Transaction";
import Transactions from "../Transactions";

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
  { id: "0", name: "account 1", balance: 1000 },
  { id: "1", name: "account 2", balance: 500 },
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
