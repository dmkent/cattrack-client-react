import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { AccountDetail, AccountDetailProps } from "../AccountDetail";

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
    uploadToAccount: vi.fn(),
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
