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

async function selectEnhanced(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByLabelText("Implementation"),
    "EnhancedSklearnCategoriser",
  );
}

describe("CrossValidationForm", () => {
  it("should render all form fields", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={false} />);

    expect(screen.getByLabelText("From date")).toBeTruthy();
    expect(screen.getByLabelText("To date")).toBeTruthy();
    expect(screen.getByLabelText("Split ratio")).toBeTruthy();
    expect(screen.getByLabelText("Implementation")).toBeTruthy();
    expect(screen.getByLabelText("Alpha")).toBeTruthy();
    expect(screen.getByLabelText("Random seed (optional)")).toBeTruthy();
    expect(screen.getByText("Run Cross-Validation")).toBeTruthy();
  });

  it("should offer both implementation options", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={false} />);

    const select = screen.getByLabelText(
      "Implementation",
    ) as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("SklearnCategoriser");
    expect(values).toContain("EnhancedSklearnCategoriser");
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

  it("should include alpha for either implementation when provided", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await user.type(screen.getByLabelText("Alpha"), "0.01");
    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ alpha: 0.01 }),
      );
    });
  });

  it("should hide Enhanced-only fields when SklearnCategoriser is selected", () => {
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={false} />);

    expect(screen.queryByText("Advanced options")).toBeNull();
    expect(
      screen.queryByLabelText("Compare against SklearnCategoriser baseline"),
    ).toBeNull();
  });

  it("should reveal Enhanced-only fields when EnhancedSklearnCategoriser is selected", async () => {
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={vi.fn()} isRunning={false} />);

    await selectEnhanced(user);

    expect(screen.getByText("Advanced options")).toBeTruthy();
    expect(
      screen.getByLabelText("Compare against SklearnCategoriser baseline"),
    ).toBeTruthy();
  });

  it("should omit empty advanced fields from the submitted request", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await selectEnhanced(user);
    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    const request = onSubmit.mock.calls[0][0];
    expect(request.threshold).toBeUndefined();
    expect(request.margin).toBeUndefined();
    expect(request.min_df).toBeUndefined();
    expect(request.max_df).toBeUndefined();
    expect(request.calibration_cv).toBeUndefined();
    expect(request.min_category_samples).toBeUndefined();
    expect(request.compare_against_baseline).toBeUndefined();
  });

  it("should forward filled advanced fields as numbers and baseline toggle as boolean", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await selectEnhanced(user);
    await user.click(screen.getByText("Advanced options"));

    await user.type(screen.getByLabelText("Threshold"), "0.55");
    await user.type(screen.getByLabelText("Margin"), "0.1");
    await user.type(screen.getByLabelText("Calibration CV splits"), "3");
    await user.type(screen.getByLabelText("Min document frequency"), "2");
    await user.type(screen.getByLabelText("Max document frequency"), "0.9");
    await user.type(screen.getByLabelText("Min samples per category"), "4");
    await user.click(
      screen.getByLabelText("Compare against SklearnCategoriser baseline"),
    );

    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          implementation: "EnhancedSklearnCategoriser",
          threshold: 0.55,
          margin: 0.1,
          calibration_cv: 3,
          min_df: 2,
          max_df: 0.9,
          min_category_samples: 4,
          compare_against_baseline: true,
        }),
      );
    });
  });

  it("should not forward Enhanced-only values when switching back to SklearnCategoriser", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CrossValidationForm onSubmit={onSubmit} isRunning={false} />);

    fillDates();
    await selectEnhanced(user);
    await user.click(screen.getByText("Advanced options"));
    await user.type(screen.getByLabelText("Threshold"), "0.7");
    await user.click(
      screen.getByLabelText("Compare against SklearnCategoriser baseline"),
    );

    // Switch back to the default implementation. react-hook-form keeps the
    // threshold value in state, but it must not be forwarded.
    await user.selectOptions(
      screen.getByLabelText("Implementation"),
      "SklearnCategoriser",
    );

    await user.click(screen.getByText("Run Cross-Validation"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    const request = onSubmit.mock.calls[0][0];
    expect(request.implementation).toBe("SklearnCategoriser");
    expect(request.threshold).toBeUndefined();
    expect(request.compare_against_baseline).toBeUndefined();
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
