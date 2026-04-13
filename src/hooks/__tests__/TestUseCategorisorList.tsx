import { screen, waitFor } from "@testing-library/react";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { SavedModel } from "../../data/CrossValidation";
import { useCategorisorList } from "../useCategorisorList";

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

function TestHarness() {
  const { data, isLoading, error } = useCategorisorList();

  if (isLoading) return <div data-testid="loading">Loading</div>;
  if (error) return <div data-testid="error">{(error as Error).message}</div>;

  return (
    <div data-testid="models">{JSON.stringify(data)}</div>
  );
}

describe("useCategorisorList", () => {
  it("should fetch categorisor list from paginated response", async () => {
    renderWithProviders(
      <TestHarness />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onGet("/api/categorisor/").reply(200, mockModels);
      },
    );

    await waitFor(() => {
      const output = screen.getByTestId("models").textContent!;
      const parsed = JSON.parse(output);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe("model-a");
      expect(parsed[1].name).toBe("model-b");
    });
  });

  it("should handle fetch error", async () => {
    renderWithProviders(
      <TestHarness />,
      undefined,
      (mockAdapter: AxiosMockAdapter) => {
        mockAdapter.onGet("/api/categorisor/").networkError();
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeTruthy();
    });
  });
});
