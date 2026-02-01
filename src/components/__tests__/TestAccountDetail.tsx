import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";

import * as useUpdateAccountsModule from "../../hooks/useUpdateAccounts";
import { AccountDetail, AccountDetailProps } from "../AccountDetail";

// Mock the useUpdateAccounts hook
vi.mock("../../hooks/useUpdateAccounts");

let queryClient: QueryClient;

function setup(account_id: string) {
  const props: AccountDetailProps = {
    account: {
      id: account_id,
      name: "Test Account",
      balance: null,
      last_transaction: null,
    },
    accountSeries: [],
  };

  const result = render(
    <QueryClientProvider client={queryClient}>
      <AccountDetail {...props} />
    </QueryClientProvider>,
  );

  return { props, ...result };
}

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
});

test("should render self and subcomponents", () => {
  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: vi.fn(),
    createAccount: vi.fn(),
  });

  setup("0");

  expect(screen.getByLabelText("Load data:")).toBeTruthy();
  expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy();
});

test("should disable submit button when no file selected", () => {
  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: vi.fn(),
    createAccount: vi.fn(),
  });

  setup("0");

  const submitButton = screen.getByRole("button", { name: /submit/i });
  expect(submitButton).toBeDisabled();
});

test("should enable submit button when file is selected", async () => {
  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: vi.fn(),
    createAccount: vi.fn(),
  });

  setup("0");

  const file = new File(["test content"], "test.csv", { type: "text/csv" });
  const fileInput = screen.getByLabelText("Load data:") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  await waitFor(() => {
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
  });
});

test("should show progress bar when uploading", async () => {
  const mockUpload = vi.fn(
    async (
      _account,
      _file,
      _fromDate,
      _toDate,
      onProgress?: (progress: number) => void,
    ) => {
      if (onProgress) {
        onProgress(50);
      }
      // Simulate async upload
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
  );

  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: mockUpload,
    createAccount: vi.fn(),
  });

  setup("0");

  const file = new File(["test content"], "test.csv", { type: "text/csv" });
  const fileInput = screen.getByLabelText("Load data:") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  const form = screen.getByRole("button", { name: /submit/i }).closest("form");
  expect(form).toBeTruthy();

  fireEvent.submit(form!);

  await waitFor(() => {
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });
});

test("should disable controls during upload", async () => {
  const mockUpload = vi.fn(
    async (
      _account,
      _file,
      _fromDate,
      _toDate,
      onProgress?: (progress: number) => void,
    ) => {
      if (onProgress) {
        onProgress(50);
      }
      // Simulate long upload
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
  );

  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: mockUpload,
    createAccount: vi.fn(),
  });

  setup("0");

  const file = new File(["test content"], "test.csv", { type: "text/csv" });
  const fileInput = screen.getByLabelText("Load data:") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  const form = screen.getByRole("button", { name: /submit/i }).closest("form");
  fireEvent.submit(form!);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /uploading/i })).toBeDisabled();
    expect(fileInput).toBeDisabled();
  });
});

test("should show success message after upload", async () => {
  const mockUpload = vi.fn().mockResolvedValue(undefined);

  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: mockUpload,
    createAccount: vi.fn(),
  });

  setup("0");

  const file = new File(["test content"], "test.csv", { type: "text/csv" });
  const fileInput = screen.getByLabelText("Load data:") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  const form = screen.getByRole("button", { name: /submit/i }).closest("form");
  fireEvent.submit(form!);

  await waitFor(() => {
    expect(screen.getByText("File uploaded successfully")).toBeTruthy();
  });
});

test("should show error message on upload failure", async () => {
  const mockUpload = vi
    .fn()
    .mockRejectedValue(new Error("Network error occurred"));

  vi.mocked(useUpdateAccountsModule.useUpdateAccounts).mockReturnValue({
    uploadFileToAccount: mockUpload,
    createAccount: vi.fn(),
  });

  setup("0");

  const file = new File(["test content"], "test.csv", { type: "text/csv" });
  const fileInput = screen.getByLabelText("Load data:") as HTMLInputElement;

  fireEvent.change(fileInput, { target: { files: [file] } });

  const form = screen.getByRole("button", { name: /submit/i }).closest("form");
  fireEvent.submit(form!);

  await waitFor(() => {
    expect(screen.getByText("Network error occurred")).toBeTruthy();
  });
});
