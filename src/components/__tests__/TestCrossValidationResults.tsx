import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  CrossValidateResult,
  FailedPrediction,
} from "../../data/CrossValidation";
import { CrossValidationResults } from "../CrossValidationResults";

function makeFailedPrediction(id: number, score = 65): FailedPrediction {
  return {
    transaction: {
      url: `http://localhost:8000/api/transactions/${id}/`,
      id,
      when: "2025-03-15T10:30:00Z",
      amount: "12.50",
      description: `Transaction ${id}`,
      category: 5,
      category_name: "Shopping",
      account: 1,
    },
    modelled: {
      id: 3,
      name: "Transport",
      score,
    },
  };
}

const baseResult: CrossValidateResult = {
  status: "ok",
  random_seed: 42,
  implementation: "SklearnCategoriser",
  from_date: "2025-01-01",
  to_date: "2025-12-31",
  split_ratio: 0.5,
  calibration_size: 150,
  validation_size: 150,
  accuracy: 0.87,
  count: 150,
  matched: 130,
  category_metrics: [
    { category_name: "Shopping", correct: 45, total: 50, precision: 0.9 },
    { category_name: "Transport", correct: 30, total: 35, precision: 0.857 },
  ],
  failed: [makeFailedPrediction(1)],
};

describe("CrossValidationResults", () => {
  it("should render accuracy summary", () => {
    render(<CrossValidationResults result={baseResult} onSave={vi.fn()} />);

    expect(screen.getByText("87.0%")).toBeTruthy();
    expect(screen.getByText("130 / 150")).toBeTruthy();
    expect(screen.getByText("Calibration set")).toBeTruthy();
    expect(screen.getByText("Validation set")).toBeTruthy();
  });

  it("should render category metrics sorted by precision ascending", () => {
    render(<CrossValidationResults result={baseResult} onSave={vi.fn()} />);

    const table = screen.getByText("Per-Category Precision").nextElementSibling as HTMLElement;
    expect(within(table).getByText("Shopping")).toBeTruthy();
    expect(within(table).getByText("Transport")).toBeTruthy();
    expect(within(table).getByText("90.0%")).toBeTruthy();
    expect(within(table).getByText("85.7%")).toBeTruthy();

    // Verify sort order: Transport (85.7%) should come before Shopping (90.0%)
    const rows = within(table).getAllByRole("row");
    expect(within(rows[1]).getByText("Transport")).toBeTruthy();
    expect(within(rows[2]).getByText("Shopping")).toBeTruthy();
  });

  it("should render failed predictions accordion", () => {
    render(<CrossValidationResults result={baseResult} onSave={vi.fn()} />);

    expect(screen.getByText("Failed Predictions (1)")).toBeTruthy();
  });

  it("should paginate failed predictions", async () => {
    const user = userEvent.setup();
    const failed = Array.from({ length: 15 }, (_, i) =>
      makeFailedPrediction(i + 1),
    );
    const result = { ...baseResult, failed };

    render(<CrossValidationResults result={result} onSave={vi.fn()} />);

    // Expand accordion
    await user.click(screen.getByText("Failed Predictions (15)"));

    // First page shows 10 items
    expect(screen.getByText("1-10 of 15")).toBeTruthy();
    expect(screen.getByText("Transaction 1")).toBeTruthy();
    expect(screen.queryByText("Transaction 11")).toBeNull();

    // Go to next page via the pagination list
    const pagination = screen.getByLabelText("Failed predictions pagination");
    const [, nextItem] = within(pagination).getAllByRole("listitem");
    await user.click(within(nextItem).getByRole("button"));

    expect(screen.getByText("11-15 of 15")).toBeTruthy();
    expect(screen.getByText("Transaction 11")).toBeTruthy();
    expect(screen.queryByText("Transaction 1")).toBeNull();
  });

  it("should call onSave when Save Model is clicked", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationResults result={baseResult} onSave={onSave} />);

    await user.click(screen.getByText("Save Model"));

    expect(onSave).toHaveBeenCalledOnce();
  });

  it("should sort failed predictions by score descending", async () => {
    const user = userEvent.setup();
    const failed = [
      makeFailedPrediction(1, 30),
      makeFailedPrediction(2, 90),
      makeFailedPrediction(3, 60),
    ];
    const result = { ...baseResult, failed };

    render(<CrossValidationResults result={result} onSave={vi.fn()} />);
    await user.click(screen.getByText("Failed Predictions (3)"));

    const tbody = screen.getAllByRole("rowgroup")[3]; // second table's tbody
    const rows = within(tbody).getAllByRole("row");
    expect(within(rows[0]).getByText("90.0%")).toBeTruthy();
    expect(within(rows[1]).getByText("60.0%")).toBeTruthy();
    expect(within(rows[2]).getByText("30.0%")).toBeTruthy();
  });

  it("should not show accordion when no failed predictions", () => {
    const result = { ...baseResult, failed: [] };
    render(<CrossValidationResults result={result} onSave={vi.fn()} />);

    expect(screen.queryByText(/Failed Predictions/)).toBeNull();
  });

  it("should reset pagination when result changes", async () => {
    const user = userEvent.setup();
    const failed = Array.from({ length: 15 }, (_, i) =>
      makeFailedPrediction(i + 1),
    );
    const result1 = { ...baseResult, failed };

    const { rerender } = render(
      <CrossValidationResults result={result1} onSave={vi.fn()} />,
    );

    // Expand accordion and go to page 2
    await user.click(screen.getByText("Failed Predictions (15)"));
    const pagination = screen.getByLabelText("Failed predictions pagination");
    const [, nextItem] = within(pagination).getAllByRole("listitem");
    await user.click(within(nextItem).getByRole("button"));
    expect(screen.getByText("11-15 of 15")).toBeTruthy();

    // Re-render with a new result that has fewer failures
    const result2 = {
      ...baseResult,
      failed: [makeFailedPrediction(100), makeFailedPrediction(101)],
    };
    rerender(<CrossValidationResults result={result2} onSave={vi.fn()} />);

    // Should be back on first page, no pagination shown (only 2 items)
    expect(screen.queryByText("11-15 of 15")).toBeNull();
    expect(screen.getByText("Failed Predictions (2)")).toBeTruthy();
  });
});
