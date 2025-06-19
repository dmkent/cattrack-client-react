import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";

import { renderWithProviders } from "../../RenderWithProviders";
import { Tracking } from "../Tracking";

const categories = [
  { id: 3, name: "cat1" },
  { id: 2, name: "cat2" },
  { id: 1, name: "cat3" },
];
const series = [
  { value: "-43", label: "2013-01-01" },
  { value: "-33", label: "2013-02-01" },
  { value: "-5", label: "2013-03-01" },
];

test("should render self and subcomponents", async () => {
  const props = {};

  renderWithProviders(
    <Tracking {...props} />,
    {},
    (mockAdapter) => {
      mockAdapter.onGet("/api/categories/").reply(200, categories);
      mockAdapter.onGet("/api/category/3/series/").reply(200, [series]);
    }
  );
  await waitFor(() => screen.getByText("Spending tracking"));

  expect(screen.getAllByRole("option").length).toBe(3);

  fireEvent.change(screen.getByRole("combobox"), {
    target: {
      value: 1,
    },
  });
});
