import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import Accounts from "../Accounts";
import { renderWithProviders } from "../../RenderWithProviders";
import { Account } from "../../data/Account";
import AxiosMockAdapter from "axios-mock-adapter";


async function setup(
  accounts: Account[],
): Promise<void> {
  const props = {}
  renderWithProviders(
    <Accounts {...props} />,
    undefined,
    (mockAdapter: AxiosMockAdapter) =>
      mockAdapter.onGet("http://localhost:8000/api/accounts/").reply(200, accounts)
  );
  await waitFor(() => screen.getByRole("heading", { name: "Accounts" }));
  return;
}

test("should render self and subcomponents", async () => {
  await setup([{ id: "0", name: "acct1", balance: null }]);

  expect(screen.getAllByRole("row").length).toBe(1);
});

test("should call selectAccount when row clicked", async () => {
  await setup(
    [
      { id: "0", name: "acct1", balance: null },
      { id: "1", name: "acct2", balance: null },
    ]
  );

  // Click a row
  fireEvent.click(screen.getByRole("row", { name: "acct1 $0.00" }));
  expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
});

test("should call show popover with form when add button clicked", async () => {
  await setup([{ id: "0", name: "acct1", balance: null }]);

  // Click a row
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("tooltip")).toBeTruthy();
  expect(screen.getByRole("textbox")).toHaveValue("");
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "testname" },
  });
  expect(screen.getByRole("textbox")).toHaveValue("testname");
});
