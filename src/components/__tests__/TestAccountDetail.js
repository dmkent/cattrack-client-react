import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Immutable from "immutable";
import AccountDetail from "../AccountDetail";
import Account from "../../data/Account";

function setup(account_id, uploading) {
  const props = {
    account: {
      id: account_id,
    },
    accountSeries: Immutable.List([Immutable.Map()]),
    uploadInProgress: uploading,
    uploadProgress: 50,
    uploadResult: "",
    uploadToAccount: jest.fn(),
  };

  render(<AccountDetail {...props} />);

  return props;
}

test("should render self and subcomponents", () => {
  setup(0, false);

  expect(screen.getByLabelText("Load data:")).toBeTruthy();
});

test("should render progress bar when uploading", () => {
  setup(0, true);

  expect(screen.getByRole("progressbar")).toBeTruthy();
});
