import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import Immutable from "immutable";

import authService from "../../services/auth.service";
import { Tracking } from "../Tracking";

const categories = [
  { id: 3, name: "cat1" },
  { id: 2, name: "cat2" },
  { id: 1, name: "cat3" },
];
const series = Immutable.List([
  Immutable.Map({ value: "-43", label: "2013-01-01" }),
  Immutable.Map({ value: "-33", label: "2013-02-01" }),
  Immutable.Map({ value: "-5", label: "2013-03-01" }),
]);

test("should render self and subcomponents", async () => {
  const props = {};
  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/categories/").reply(200, categories);
  nock("http://localhost:8000")
    .get("/api/category/3/series/")
    .reply(200, [series]);

  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Tracking {...props} />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Spending tracking"));

  expect(screen.getAllByRole("option").length).toBe(3);

  fireEvent.change(screen.getByRole("combobox"), {
    target: {
      value: 1,
    },
  });
});
