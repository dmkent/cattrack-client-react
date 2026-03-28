import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CrossValidationForm } from "../CrossValidationForm";

function fillDates() {
  fireEvent.change(screen.getByLabelText("From date"), {
    target: { value: "2025-01-01" },
  });
  fireEvent.change(screen.getByLabelText("To date"), {
    target: { value: "2025-12-31" },
  });
}

describe("CrossValidationForm", () => {
  it("should render all form fields", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={false} />);

    expect(screen.getByLabelText("From date")).toBeTruthy();
    expect(screen.getByLabelText("To date")).toBeTruthy();
    expect(screen.getByLabelText("Split ratio")).toBeTruthy();
    expect(screen.getByLabelText("Implementation")).toBeTruthy();
    expect(screen.getByLabelText("Random seed (optional)")).toBeTruthy();
    expect(screen.getByText("Run Cross-Validation")).toBeTruthy();
  });

  it("should call onSubmit with correct values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        from_date: "2025-01-01",
        to_date: "2025-12-31",
        split_ratio: 0.5,
        implementation: "SklearnCategoriser",
      });
    });
  });

  it("should include random_seed when provided", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await user.clear(screen.getByLabelText("Random seed (optional)"));
    await user.type(screen.getByLabelText("Random seed (optional)"), "42");
    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ random_seed: 42 }),
      );
    });
  });

  it("should disable submit button when running", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={true} />);

    expect(
      screen.getByText("Run Cross-Validation").closest("button"),
    ).toHaveProperty("disabled", true);
  });

  it("should show spinner when running", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={true} />);

    expect(screen.getByRole("status")).toBeTruthy();
  });
});
