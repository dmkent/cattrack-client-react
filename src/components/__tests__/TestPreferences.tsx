import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { CrossValidateResult, SavedModel } from "../../data/CrossValidation";
import { Preferences } from "../Preferences";

const mockResult: CrossValidateResult = {
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
  ],
  failed: [],
};

const mockSavedModel: SavedModel = {
  url: "http://localhost:8000/api/categorisor/5/",
  id: 5,
  name: "my-model",
  implementation: "SklearnCategoriser",
  from_date: "2025-01-01",
  to_date: "2025-12-31",
};

function setup(mockAdapter: AxiosMockAdapter) {
  mockAdapter
    .onPost("/api/categorisor/cross_validate/")
    .reply(200, mockResult);
  mockAdapter
    .onPost("/api/categorisor/cross_validate_save/")
    .reply(201, mockSavedModel);
  mockAdapter
    .onPost("/api/categorisor/5/set_default/")
    .reply(200, { detail: "Model set as default." });
}

function setupError(mockAdapter: AxiosMockAdapter) {
  mockAdapter.onPost("/api/categorisor/cross_validate/").reply(200, {
    status: "error",
    message: "Insufficient transactions for cross-validation.",
  });
}

async function fillAndSubmitForm(user: ReturnType<typeof userEvent.setup>) {
  fireEvent.change(screen.getByLabelText("From date"), {
    target: { value: "2025-01-01" },
  });
  fireEvent.change(screen.getByLabelText("To date"), {
    target: { value: "2025-12-31" },
  });
  await user.click(screen.getByText("Run Cross-Validation"));
}

describe("Preferences", () => {
  it("should render the form", () => {
    renderWithProviders(<Preferences />);

    expect(screen.getByText("Preferences")).toBeTruthy();
    expect(screen.getByText("Model Calibration")).toBeTruthy();
    expect(screen.getByText("Run Cross-Validation")).toBeTruthy();
  });

  it("should show results after running cross-validation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setup);

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(screen.getByText("87.0%")).toBeTruthy();
      expect(screen.getByText("130 / 150")).toBeTruthy();
    });
  });

  it("should show error on failed cross-validation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setupError);

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Insufficient transactions for cross-validation.",
        ),
      ).toBeTruthy();
    });
  });

  it("should open save modal and save model with set-as-default option", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setup);

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));

    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.type(screen.getByLabelText("Model name"), "my-model");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText('Model "my-model" saved successfully.'),
      ).toBeTruthy();
      // "Set as Default" button should appear since set_as_default was unchecked
      expect(screen.getByText("Set as Default")).toBeTruthy();
    });
  });

  it("should dismiss error alert", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setupError);

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(
        screen.getByText("Insufficient transactions for cross-validation."),
      ).toBeTruthy();
    });

    // Dismiss the error alert
    await user.click(screen.getByRole("button", { name: "Close alert" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Insufficient transactions for cross-validation."),
      ).toBeNull();
    });
  });

  it("should dismiss success alert and clear saved model", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setup);

    await fillAndSubmitForm(user);
    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.type(screen.getByLabelText("Model name"), "my-model");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(
        screen.getByText('Model "my-model" saved successfully.'),
      ).toBeTruthy();
    });

    // Dismiss the success alert
    await user.click(screen.getByRole("button", { name: "Close alert" }));

    await waitFor(() => {
      expect(
        screen.queryByText('Model "my-model" saved successfully.'),
      ).toBeNull();
      expect(screen.queryByText("Set as Default")).toBeNull();
    });
  });

  it("should close save modal via cancel", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setup);

    await fillAndSubmitForm(user);
    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByLabelText("Model name")).toBeNull();
    });
  });

  it("should show save error when save fails", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Preferences />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter
          .onPost("/api/categorisor/cross_validate/")
          .reply(200, mockResult);
        mockAdapter
          .onPost("/api/categorisor/cross_validate_save/")
          .reply(400, { error: "Name already exists" });
      },
    );

    await fillAndSubmitForm(user);
    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.type(screen.getByLabelText("Model name"), "duplicate");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      // Modal should still be open with an error shown
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });
  });

  it("should clear save error when modal is closed and reopened", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Preferences />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter
          .onPost("/api/categorisor/cross_validate/")
          .reply(200, mockResult);
        mockAdapter
          .onPost("/api/categorisor/cross_validate_save/")
          .replyOnce(400, { error: "Name already exists" })
          .onPost("/api/categorisor/cross_validate_save/")
          .reply(201, mockSavedModel);
      },
    );

    // Run cross-validation and open save modal
    await fillAndSubmitForm(user);
    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });
    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    // Trigger a save error
    await user.type(screen.getByLabelText("Model name"), "duplicate");
    await user.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    // Close modal and reopen — error should be gone
    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByLabelText("Model name")).toBeNull();
    });

    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
      // No error alerts should be visible inside the modal
      expect(
        screen.queryByText("Name already exists"),
      ).toBeNull();
    });
  });

  it("should show error when set-default fails", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Preferences />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter
          .onPost("/api/categorisor/cross_validate/")
          .reply(200, mockResult);
        mockAdapter
          .onPost("/api/categorisor/cross_validate_save/")
          .reply(201, mockSavedModel);
        mockAdapter
          .onPost("/api/categorisor/5/set_default/")
          .networkError();
      },
    );

    await fillAndSubmitForm(user);
    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));
    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.type(screen.getByLabelText("Model name"), "my-model");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Set as Default")).toBeTruthy();
    });

    await user.click(screen.getByText("Set as Default"));

    await waitFor(() => {
      // Error alert should appear (danger variant)
      const alerts = screen.getAllByRole("alert");
      const dangerAlert = alerts.find((el) =>
        el.classList.contains("alert-danger"),
      );
      expect(dangerAlert).toBeTruthy();
    });
  });

  it("should set saved model as default", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Preferences />, undefined, setup);

    await fillAndSubmitForm(user);

    await waitFor(() => {
      expect(screen.getByText("Save Model")).toBeTruthy();
    });

    await user.click(screen.getByText("Save Model"));

    await waitFor(() => {
      expect(screen.getByLabelText("Model name")).toBeTruthy();
    });

    await user.type(screen.getByLabelText("Model name"), "my-model");
    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Set as Default")).toBeTruthy();
    });

    await user.click(screen.getByText("Set as Default"));

    await waitFor(() => {
      expect(
        screen.getByText('Model "my-model" is now the default.'),
      ).toBeTruthy();
      expect(screen.queryByText("Set as Default")).toBeNull();
    });
  });
});
