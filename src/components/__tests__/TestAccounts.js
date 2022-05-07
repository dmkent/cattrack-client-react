import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IntlProvider } from "react-intl";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import Immutable from "immutable";
import Accounts from "../Accounts";
import authService from "../../services/auth.service"

async function setup(accounts, account_id, uploading) {
  const props = {
  };

  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/accounts/").reply(200, accounts);

  const queryClient = new QueryClient();
  render(
    <IntlProvider locale="en-AU">
      <QueryClientProvider client={queryClient}>
        <Accounts {...props} />
      </QueryClientProvider>
    </IntlProvider>
  );
  await waitFor(() => screen.getByRole("heading", {name: "Accounts"}));

  return {
    props,
  };
}

test("should render self and subcomponents", async () => {
  await setup(
    [{ id: 0, name: "acct1" }],
    0,
    false
  );

  expect(screen.getAllByRole("row").length).toBe(1);
});

test("should call selectAccount when row clicked", async () => {
  await setup(
    [
      { id: 0, name: "acct1" },
      { id: 1, name: "acct2" },
    ],
    0,
    false
  );

  // Click a row
  fireEvent.click(screen.getByRole("row", {name: "acct1 $0.00"}))
  expect(screen.getByRole("button", {name: "Submit"})).toBeTruthy();
});

test("should call show popover with form when add button clicked", async () => {
  const { props } = await setup(
    [{ id: 0, name: "acct1" }],
    0,
    false
  );

  // Click a row
  fireEvent.click(screen.getByRole("button"))
  expect(screen.getByRole("tooltip")).toBeTruthy();
  expect(screen.getByRole("textbox")).toHaveValue("");
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "testname" },
  });
  expect(screen.getByRole("textbox")).toHaveValue("testname");
});
