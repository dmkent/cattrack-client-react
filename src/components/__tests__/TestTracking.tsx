import { screen, waitFor, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { SeriesPoint } from "../../data/Account";
import { Category, CategoryGroup } from "../../data/Category";
import { Tracking } from "../Tracking";

const categories: Category[] = [
  { id: "3", name: "cat1", score: 0.5 },
  { id: "2", name: "cat2", score: 1 },
  { id: "1", name: "cat3", score: 2 },
];

const categoryGroups: CategoryGroup[] = [
  { id: "10", name: "Group 1" },
  { id: "20", name: "Group 2" },
];

const series: SeriesPoint[] = [
  { value: -43, label: "2013-01-01" },
  { value: -33, label: "2013-02-01" },
  { value: -5, label: "2013-03-01" },
];

const groupSeries: SeriesPoint[] = [
  { value: -100, label: "2013-01-01" },
  { value: -150, label: "2013-02-01" },
  { value: -80, label: "2013-03-01" },
];

test("should render self and subcomponents", async () => {
  const props = {};

  renderWithProviders(<Tracking {...props} />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/categories/").reply(200, categories);
    mockAdapter.onGet("/api/category-groups/").reply(200, []);
    mockAdapter.onGet("/api/category/3/series/").reply(200, [series]);
  });
  await waitFor(() => screen.getByText("Spending tracking"));

  expect(screen.getAllByRole("option").length).toBe(3);

  fireEvent.change(screen.getByRole("combobox"), {
    target: {
      value: "category:1",
    },
  });
});

test("should render categories and category groups", async () => {
  renderWithProviders(<Tracking />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/categories/").reply(200, categories);
    mockAdapter.onGet("/api/category-groups/").reply(200, categoryGroups);
    mockAdapter.onGet("/api/categories/3/series/").reply(200, series);
  });

  await waitFor(() => screen.getByText("Spending tracking"));

  // Should have 3 categories + 2 groups = 5 options
  expect(screen.getAllByRole("option").length).toBe(5);

  // Check that both category and group options are present
  expect(screen.getByText("cat1")).toBeInTheDocument();
  expect(screen.getByText("Group 1")).toBeInTheDocument();
});

test("should switch between category and category group", async () => {
  renderWithProviders(<Tracking />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/categories/").reply(200, categories);
    mockAdapter.onGet("/api/category-groups/").reply(200, categoryGroups);
    mockAdapter.onGet("/api/categories/3/series/").reply(200, series);
    mockAdapter
      .onGet("/api/category-groups/10/weekly_summary/")
      .reply(200, groupSeries);
  });

  await waitFor(() => screen.getByText("Spending tracking"));

  // Initially should select first category
  const combobox = screen.getByRole("combobox");
  expect(combobox).toHaveValue("category:3");

  // Switch to category group
  fireEvent.change(combobox, {
    target: { value: "categoryGroup:10" },
  });

  expect(combobox).toHaveValue("categoryGroup:10");
});

test("should auto-select category group when no categories available", async () => {
  renderWithProviders(<Tracking />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/categories/").reply(200, []);
    mockAdapter.onGet("/api/category-groups/").reply(200, categoryGroups);
    mockAdapter
      .onGet("/api/category-groups/10/weekly_summary/")
      .reply(200, groupSeries);
  });

  await waitFor(() => screen.getByText("Spending tracking"));

  const combobox = screen.getByRole("combobox");
  expect(combobox).toHaveValue("categoryGroup:10");
});
