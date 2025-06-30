import { screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Dashboard } from "../Dashboard";

const periods = [
  {
    id: 4,
    label: "Last month",
    from_date: "2011-01-02",
    to_date: "2011-02-02",
    offset: "1",
  },
  {
    id: 1,
    label: "Last week",
    from_date: "2011-01-24",
    to_date: "2011-02-02",
    offset: "1",
  },
];

test("should render self and subcomponents", async () => {
  renderWithProviders(<Dashboard />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/periods/").reply(200, periods);
    mockAdapter.onGet("/api/transactions/summary/").reply(200, []);
  });
  await waitFor(() => screen.getByText("Time"));

  expect(screen.getByRole("button", { name: "Last month" })).toBeTruthy();
});
