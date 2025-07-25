import { screen, waitFor, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { PaymentSeriesItem } from "../../data/PaymentSeries";
import { PaymentSeries } from "../PaymentSeries";

const payments: PaymentSeriesItem[] = [
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
  renderWithProviders(<PaymentSeries />, undefined, (mockAdapter) => {
    mockAdapter.onGet("/api/payments/").reply(200, payments);
  });
  await waitFor(() => screen.getByText("Elec"));

  fireEvent.click(screen.getByText("Elec"));

  expect(screen.getByText("$100.00")).toBeTruthy();
});
