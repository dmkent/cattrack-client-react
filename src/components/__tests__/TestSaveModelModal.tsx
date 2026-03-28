import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SaveModelModal } from "../SaveModelModal";

const defaultProps = {
  show: true,
  onHide: vi.fn(),
  onSave: vi.fn(),
  isSaving: false,
};

describe("SaveModelModal", () => {
  it("should render when shown", () => {
    render(<SaveModelModal {...defaultProps} />);

    expect(screen.getByText("Save Model")).toBeTruthy();
    expect(screen.getByLabelText("Model name")).toBeTruthy();
    expect(screen.getByLabelText("Re-train on full dataset")).toBeTruthy();
    expect(screen.getByLabelText("Set as default model")).toBeTruthy();
  });

  it("should not render when hidden", () => {
    render(<SaveModelModal {...defaultProps} show={false} />);

    expect(screen.queryByText("Save Model")).toBeNull();
  });

  it("should call onSave with form values", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SaveModelModal {...defaultProps} onSave={onSave} />);

    await user.type(screen.getByLabelText("Model name"), "my-model");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "my-model",
        recalibrate_full: true,
        set_as_default: false,
      });
    });
  });

  it("should call onHide when Cancel is clicked", async () => {
    const onHide = vi.fn();
    const user = userEvent.setup();
    render(<SaveModelModal {...defaultProps} onHide={onHide} />);

    await user.click(screen.getByText("Cancel"));

    expect(onHide).toHaveBeenCalledOnce();
  });

  it("should show error alert", () => {
    render(<SaveModelModal {...defaultProps} error="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("should disable Save button when saving", () => {
    render(<SaveModelModal {...defaultProps} isSaving={true} />);

    expect(screen.getByText("Save").closest("button")).toHaveProperty(
      "disabled",
      true,
    );
  });

  it("should show spinner when saving", () => {
    render(<SaveModelModal {...defaultProps} isSaving={true} />);

    expect(screen.getByRole("status")).toBeTruthy();
  });
});
