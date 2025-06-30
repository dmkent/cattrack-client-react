import { screen, waitFor, fireEvent } from "@testing-library/react";
import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { vi, MockedFunction, test, expect } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Category } from "../../data/Category";
import { Transaction } from "../../data/Transaction";
import Categorisor, { CategorisorProps } from "../Categorisor";

const categories: Category[] = [
  { id: "0", name: "Cat1", score: 0 },
  { id: "3", name: "Cat2", score: 0 },
];

function setup(
  transaction: Transaction,
  suggestions: Category[],
): {
  axiosInstance: AxiosInstance;
  props: CategorisorProps;
  saveMock: MockedFunction<() => Promise<void>>;
} {
  const saveMock = vi.fn(() => Promise.resolve());
  const props: CategorisorProps = {
    transaction,
    showModal: true,
    setModalShown: vi.fn(),
    save: saveMock,
  };
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
  });

  const mockAdapter = new AxiosMockAdapter(axiosInstance);
  mockAdapter.onGet("/api/categories/").reply(200, categories);
  mockAdapter
    .onGet("/api/transactions/" + transaction.id + "/suggest")
    .reply(200, suggestions);

  return { axiosInstance, props, saveMock };
}

test("Categorisor: should render if transaction is defined", async () => {
  const { props, axiosInstance } = setup(
    {
      id: "1",
      description: "test",
      when: new Date("2012-01-01"),
      amount: -34.4,
      category: "0",
      category_name: "Test Category",
      account: "1",
    },
    [],
  );
  renderWithProviders(
    <Categorisor {...props} />,
    undefined,
    undefined,
    axiosInstance,
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(screen.getAllByRole("dialog")).toBeTruthy();
});

test("Categorisor: should render suggestions if defined", async () => {
  const { props, axiosInstance } = setup(
    {
      id: "1",
      description: "test",
      when: new Date("2012-01-01"),
      amount: -34.4,
      category: "0",
      category_name: "Test Category",
      account: "1",
    },
    [
      { id: "1", name: "suggest1", score: 80 },
      { id: "2", name: "suggest2", score: 60 },
    ],
  );
  renderWithProviders(
    <Categorisor {...props} />,
    undefined,
    undefined,
    axiosInstance,
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(screen.getAllByRole("dialog")).toBeTruthy();
  expect(screen.getByText("suggest1")).toBeTruthy();
  expect(screen.getByText("suggest2")).toBeTruthy();
});

test("Categorisor: should call save on button click", async () => {
  const { props, axiosInstance, saveMock } = setup(
    {
      id: "1",
      description: "test",
      when: new Date("2012-01-01"),
      amount: -34.4,
      category: "0",
      category_name: "Test Category",
      account: "1",
    },
    [],
  );

  renderWithProviders(
    <Categorisor {...props} />,
    undefined,
    undefined,
    axiosInstance,
  );
  await waitFor(() => screen.getByText("Categorise transaction"));

  expect(saveMock.mock.calls.length).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(saveMock.mock.calls.length).toBe(1);
});

test("Categorisor: should show alert if not valid", async () => {
  const { props, axiosInstance } = setup(
    {
      id: "1",
      description: "test",
      when: new Date("2012-01-01"),
      amount: -34.4,
      category: "0",
      category_name: "Test Category",
      account: "1",
    },
    [],
  );

  renderWithProviders(
    <Categorisor {...props} />,
    undefined,
    undefined,
    axiosInstance,
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
