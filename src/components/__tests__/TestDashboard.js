import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor } from "@testing-library/react";
import nock from "nock";

import authService from "../../services/auth.service";
import Dashboard from "../Dashboard";

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
  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/periods/").reply(200, periods);
  nock("http://localhost:8000").get("/api/transactions/summary/").reply(200, []);
  
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
  await waitFor(() => screen.getByText("Time"));

  expect(screen.getByRole("button", {name: "Last month"})).toBeTruthy()
});
