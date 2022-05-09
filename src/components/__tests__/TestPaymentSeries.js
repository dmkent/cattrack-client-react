import React from "react";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import nock from "nock";
import PaymentSeries from "../PaymentSeries";
import authService from "../../services/auth.service";

const payments = [
  {
    id: "100",
    name: "Elec",
    is_income: false,
    next_due_date: null,
    bills: [
      {
        id: "1",
        due_date: 0.0,
        due_amount: 100.0,
        is_paid: false,
        description: "Test",
      },
    ],
  },
];

test("PaymentSeries should render self and subcomponents", async () => {
  authService.dummyLogin();
  nock("http://localhost:8000").get("/api/payments/").reply(200, payments);

  const queryClient = new QueryClient();
  render(
    <IntlProvider locale="en-AU">
      <QueryClientProvider client={queryClient}>
        <PaymentSeries />
      </QueryClientProvider>
    </IntlProvider>
  );
  await waitFor(() => screen.getByText("Elec"));

  fireEvent.click(screen.getByText("Elec"));

  expect(screen.getByText("$100.00")).toBeTruthy();
});
