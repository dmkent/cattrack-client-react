import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";

import { renderWithProviders } from "../../RenderWithProviders";
import { Tracking } from "../Tracking";
import { Category } from "src/data/Category";
import { SeriesPoint } from "src/data/Account";

const categories: Category[] = [
  { id: "3", name: "cat1", score: 0.5 },
  { id: "2", name: "cat2", score: 1 },
  { id: "1", name: "cat3", score: 2 },
];
const series: SeriesPoint[] = [
  { value: -43, label: "2013-01-01" },
  { value: -33, label: "2013-02-01" },
  { value: -5, label: "2013-03-01" },
];

test("should render self and subcomponents", async () => {
  const props = {};

  renderWithProviders(<Tracking {...props} />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/categories/").reply(200, categories);
    mockAdapter.onGet("/api/category/3/series/").reply(200, [series]);
  });
  await waitFor(() => screen.getByText("Spending tracking"));

  expect(screen.getAllByRole("option").length).toBe(3);

  fireEvent.change(screen.getByRole("combobox"), {
    target: {
      value: 1,
    },
  });
});
