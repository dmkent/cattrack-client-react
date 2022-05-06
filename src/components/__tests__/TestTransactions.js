import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import Immutable from "immutable";
import { FormattedDate, IntlProvider } from "react-intl";
import Transactions from "../Transactions";
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

function setup(transactions) {
  const props = {
    page_size: 20,
  };

  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/periods/").reply(200, periods);
  nock("http://localhost:8000").get("/api/accounts/").reply(200, accounts);
  nock("http://localhost:8000").get("/api/categories/").reply(200, categories);
  nock("http://localhost:8000")
    .get("/api/transactions/?page=1&page_size=20")
    .reply(200, {
      results: transactions,
      count: 40,
    });

  return props;
}

test("should render self and subcomponents", async () => {
  const props = setup([]);
  const queryClient = new QueryClient();
  render(
    <IntlProvider locale="en-AU">
      <QueryClientProvider client={queryClient}>
        <Transactions {...props} />
      </QueryClientProvider>
    </IntlProvider>
  );
  await waitFor(() => screen.getByText("Transactions"));

  expect(screen.getByRole("table")).toBeTruthy();
});

test("should display some transactions", async () => {
  const props = setup([
    {
      id: 0,
      when: new Date("2017-01-01"),
      description: "Test this",
      amount: -90.9,
    },
    {
      id: 1,
      when: new Date("2017-01-02"),
      description:
        "Test this really,  really,  really,  really,  really,  really long description",
      amount: -90.9,
    },
  ]);
  const queryClient = new QueryClient();
  render(
    <IntlProvider locale="en-AU">
      <QueryClientProvider client={queryClient}>
        <Transactions {...props} />
      </QueryClientProvider>
    </IntlProvider>
  );
  await waitFor(() => screen.getByText("Transactions"));

  expect(screen.getByRole("table").children.length).toBeTruthy();

  expect(screen.getByText("01/01/2017")).toBeTruthy();
  expect(screen.getByText("Test this")).toBeTruthy();

  expect(screen.getByText(/Test this really, +really/)).toHaveTextContent(
    "Test this really, really, really, really, real..."
  );
});
