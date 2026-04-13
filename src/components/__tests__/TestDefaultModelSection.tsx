import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { SavedModel } from "../../data/CrossValidation";
import { UserSettings } from "../../data/UserSettings";
import { DefaultModelSection } from "../DefaultModelSection";

const mockModels: SavedModel[] = [
  {
    url: "http://localhost:8000/api/categorisor/1/",
    id: 1,
    name: "model-a",
    implementation: "SklearnCategoriser",
    from_date: "2025-01-01",
    to_date: "2025-06-30",
  },
  {
    url: "http://localhost:8000/api/categorisor/2/",
    id: 2,
    name: "model-b",
    implementation: "SklearnCategoriser",
    from_date: "2025-01-01",
    to_date: "2025-12-31",
  },
];

const mockSettingsWithModel: UserSettings = {
  id: 1,
  selected_categorisor: 1,
};

const mockSettingsNoModel: UserSettings = {
  id: 1,
  selected_categorisor: null,
};

function setupWithModel(mockAdapter: AxiosMockAdapter) {
  mockAdapter.onGet("/api/user-settings/me/").reply(200, mockSettingsWithModel);
  mockAdapter.onGet("/api/categorisor/").reply(200, mockModels);
  mockAdapter.onPatch("/api/user-settings/me/").reply(200, {
    id: 1,
    selected_categorisor: 2,
  });
}

function setupNoModel(mockAdapter: AxiosMockAdapter) {
  mockAdapter.onGet("/api/user-settings/me/").reply(200, mockSettingsNoModel);
  mockAdapter.onGet("/api/categorisor/").reply(200, mockModels);
  mockAdapter.onPatch("/api/user-settings/me/").reply(200, {
    id: 1,
    selected_categorisor: 1,
  });
}

describe("DefaultModelSection", () => {
  it("should display current default model details", async () => {
    renderWithProviders(<DefaultModelSection />, undefined, setupWithModel);

    await waitFor(() => {
      expect(screen.getByText("Default Model")).toBeTruthy();
      expect(
        screen.getByText(/Current default:/),
      ).toBeTruthy();
      expect(screen.getByText("model-a")).toBeTruthy();
    });
  });

  it("should show no default model message when none set", async () => {
    renderWithProviders(<DefaultModelSection />, undefined, setupNoModel);

    await waitFor(() => {
      expect(screen.getByText("No default model set.")).toBeTruthy();
    });
  });

  it("should show available models in dropdown", async () => {
    renderWithProviders(<DefaultModelSection />, undefined, setupWithModel);

    await waitFor(() => {
      const select = screen.getByLabelText(
        "Select default model",
      ) as HTMLSelectElement;
      expect(select).toBeTruthy();
      expect(select.options).toHaveLength(3); // None + 2 models
      expect(select.value).toBe("1");
    });
  });

  it("should change default model on dropdown change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DefaultModelSection />, undefined, setupWithModel);

    await waitFor(() => {
      expect(screen.getByLabelText("Select default model")).toBeTruthy();
    });

    await user.selectOptions(screen.getByLabelText("Select default model"), "2");

    await waitFor(() => {
      expect(
        screen.getByText('Default model set to "model-b".'),
      ).toBeTruthy();
    });
  });

  it("should show success message when clearing default model", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DefaultModelSection />, undefined, setupWithModel);

    await waitFor(() => {
      expect(screen.getByLabelText("Select default model")).toBeTruthy();
    });

    await user.selectOptions(
      screen.getByLabelText("Select default model"),
      "",
    );

    await waitFor(() => {
      expect(screen.getByText("Default model cleared.")).toBeTruthy();
    });
  });

  it("should show error when update fails", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DefaultModelSection />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter
          .onGet("/api/user-settings/me/")
          .reply(200, mockSettingsWithModel);
        mockAdapter.onGet("/api/categorisor/").reply(200, mockModels);
        mockAdapter.onPatch("/api/user-settings/me/").networkError();
      },
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Select default model")).toBeTruthy();
    });

    await user.selectOptions(screen.getByLabelText("Select default model"), "2");

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      const dangerAlert = alerts.find((el) =>
        el.classList.contains("alert-danger"),
      );
      expect(dangerAlert).toBeTruthy();
    });
  });

  it("should show fetch error when settings endpoint fails", async () => {
    renderWithProviders(
      <DefaultModelSection />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onGet("/api/user-settings/me/").networkError();
        mockAdapter.onGet("/api/categorisor/").reply(200, []);
      },
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load user settings/)).toBeTruthy();
    });
  });
});
