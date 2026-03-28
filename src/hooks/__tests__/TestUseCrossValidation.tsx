import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import {
  CrossValidateResult,
  SavedModel,
} from "../../data/CrossValidation";
import { useCrossValidation } from "../useCrossValidation";

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

function TestHarness() {
  const { runCrossValidation, saveModel, setDefaultModel } =
    useCrossValidation();

  const handleRun = async () => {
    try {
      const result = await runCrossValidation({
        from_date: "2025-01-01",
        to_date: "2025-12-31",
        split_ratio: 0.5,
        implementation: "SklearnCategoriser",
      });
      document.getElementById("output")!.textContent = JSON.stringify(result);
    } catch (e: unknown) {
      document.getElementById("output")!.textContent = `error:${(e as Error).message}`;
    }
  };

  const handleSave = async () => {
    const result = await saveModel({
      name: "my-model",
      from_date: "2025-01-01",
      to_date: "2025-12-31",
      recalibrate_full: true,
      set_as_default: false,
      implementation: "SklearnCategoriser",
    });
    document.getElementById("output")!.textContent = JSON.stringify(result);
  };

  const handleSetDefault = async () => {
    await setDefaultModel(5);
    document.getElementById("output")!.textContent = "default-set";
  };

  return (
    <div>
      <button onClick={handleRun}>Run</button>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleSetDefault}>SetDefault</button>
      <div id="output" data-testid="output"></div>
    </div>
  );
}

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

describe("useCrossValidation", () => {
  it("should run cross-validation and return result", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestHarness />, undefined, setup);

    await user.click(screen.getByText("Run"));

    await waitFor(() => {
      const output = screen.getByTestId("output").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed.status).toBe("ok");
      expect(parsed.accuracy).toBe(0.87);
      expect(parsed.random_seed).toBe(42);
    });
  });

  it("should throw on error response", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestHarness />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onPost("/api/categorisor/cross_validate/").reply(200, {
          status: "error",
          message: "Insufficient transactions",
        });
      },
    );

    await user.click(screen.getByText("Run"));

    await waitFor(() => {
      expect(screen.getByTestId("output").textContent).toBe(
        "error:Insufficient transactions",
      );
    });
  });

  it("should save a model", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestHarness />, undefined, setup);

    await user.click(screen.getByText("Save"));

    await waitFor(() => {
      const output = screen.getByTestId("output").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed.id).toBe(5);
      expect(parsed.name).toBe("my-model");
    });
  });

  it("should set a model as default", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestHarness />, undefined, setup);

    await user.click(screen.getByText("SetDefault"));

    await waitFor(() => {
      expect(screen.getByTestId("output").textContent).toBe("default-set");
    });
  });
});
