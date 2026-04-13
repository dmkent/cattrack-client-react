import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { UserSettings } from "../../data/UserSettings";
import { useUserSettings } from "../useUserSettings";

const mockSettings: UserSettings = {
  id: 1,
  selected_categorisor: 3,
};

function TestHarness() {
  const { data, isLoading, error, updateDefaultModel } = useUserSettings();

  const handleUpdate = async () => {
    try {
      const result = await updateDefaultModel(7);
      document.getElementById("output")!.textContent = JSON.stringify(result);
    } catch (e: unknown) {
      document.getElementById("output")!.textContent = `error:${(e as Error).message}`;
    }
  };

  const handleClear = async () => {
    try {
      const result = await updateDefaultModel(null);
      document.getElementById("output")!.textContent = JSON.stringify(result);
    } catch (e: unknown) {
      document.getElementById("output")!.textContent = `error:${(e as Error).message}`;
    }
  };

  if (isLoading) return <div data-testid="loading">Loading</div>;
  if (error) return <div data-testid="error">{(error as Error).message}</div>;

  return (
    <div>
      <div data-testid="settings">{JSON.stringify(data)}</div>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleClear}>Clear</button>
      <div id="output" data-testid="output"></div>
    </div>
  );
}

function setup(mockAdapter: AxiosMockAdapter) {
  mockAdapter.onGet("/api/user-settings/me/").reply(200, mockSettings);
  mockAdapter.onPatch("/api/user-settings/me/").reply(200, {
    id: 1,
    selected_categorisor: 7,
  });
}

describe("useUserSettings", () => {
  it("should fetch user settings", async () => {
    renderWithProviders(<TestHarness />, undefined, setup);

    await waitFor(() => {
      const output = screen.getByTestId("settings").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed.id).toBe(1);
      expect(parsed.selected_categorisor).toBe(3);
    });
  });

  it("should update default model", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestHarness />, undefined, setup);

    await waitFor(() => {
      expect(screen.getByTestId("settings")).toBeTruthy();
    });

    await user.click(screen.getByText("Update"));

    await waitFor(() => {
      const output = screen.getByTestId("output").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed.selected_categorisor).toBe(7);
    });
  });

  it("should clear default model", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TestHarness />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onGet("/api/user-settings/me/").reply(200, mockSettings);
        mockAdapter.onPatch("/api/user-settings/me/").reply(200, {
          id: 1,
          selected_categorisor: null,
        });
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId("settings")).toBeTruthy();
    });

    await user.click(screen.getByText("Clear"));

    await waitFor(() => {
      const output = screen.getByTestId("output").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed.selected_categorisor).toBeNull();
    });
  });

  it("should handle fetch error", async () => {
    renderWithProviders(
      <TestHarness />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onGet("/api/user-settings/me/").networkError();
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeTruthy();
    });
  });
});
