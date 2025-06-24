import React from "react";
import { render, screen } from "@testing-library/react";
import AccountDetail, { AccountDetailProps } from "../AccountDetail";

function setup(account_id: string, uploading: boolean): AccountDetailProps {
  const props: AccountDetailProps = {
    account: {
      id: account_id,
      name: "Test Account",
      balance: null,
    },
    accountSeries: [],
    uploadInProgress: uploading,
    uploadProgress: 50,
    uploadResult: "",
    uploadToAccount: jest.fn(),
  };

  render(<AccountDetail {...props} />);

  return props;
}

test("should render self and subcomponents", () => {
  setup("0", false);

  expect(screen.getByLabelText("Load data:")).toBeTruthy();
});

test("should render progress bar when uploading", () => {
  setup("0", true);

  expect(screen.getByRole("progressbar")).toBeTruthy();
});
