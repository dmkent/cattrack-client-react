import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import Categorisor from "../Categorisor";
import authService from "../../services/auth.service";

const categories = [
  { id: 0, name: "Cat1" },
  { id: 3, name: "Cat2" },
];

function setup(transaction, suggestions) {
  const props = {
    transaction,
    showModal: true,
    setModalShown: jest.fn(),
    save: jest.fn(() => Promise.resolve()),
  };

  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/categories/").reply(200, categories);
  nock("http://localhost:8000")
    .get("/api/transactions/" + transaction.id + "/suggest")
    .reply(200, suggestions);

  return props;
}

test("Categorisor: should render if transaction is defined", async () => {
  let props = setup(
    {
      id: "1",
      description: "test",
      when: "2012-01-01",
      amount: -34.4,
    },
    []
  );
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Categorisor {...props} />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(screen.getAllByRole("dialog")).toBeTruthy();
});

test("Categorisor: should render suggestions if defined", async () => {
  let props = setup(
    {
      id: "1",
      description: "test",
      when: "2012-01-01",
      amount: -34.4,
    },
    [{ name: "suggest1" }, { name: "suggest2" }]
  );
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Categorisor {...props} />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(screen.getAllByRole("dialog")).toBeTruthy();
  expect(screen.getByText("suggest1")).toBeTruthy();
  expect(screen.getByText("suggest2")).toBeTruthy();
});

test("Categorisor: should call save on button click", async () => {
  let props = setup(
    {
      id: "1",
      description: "test",
      when: "2012-01-01",
      amount: -34.4,
    },
    []
  );

  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Categorisor {...props} />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(props.save.mock.calls.length).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(props.save.mock.calls.length).toBe(1);
});

test("Categorisor: should show alert if not valid", async () => {
  let props = setup(
    {
      id: "1",
      description: "test",
      when: "2012-01-01",
      amount: -34.4,
    },
    []
  );

  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Categorisor {...props} />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Add split" }));
  fireEvent.change(screen.getByTestId("splitamount-1"), {
    target: { value: "-10" },
  });
  expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  expect(screen.getByRole("alert")).toBeTruthy();
});
