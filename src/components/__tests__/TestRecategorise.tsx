import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Recategorise } from "../Recategorise";

const mockModels = [
  {
    url: "http://localhost:8000/api/categorisor/1/",
    id: 1,
    name: "test-model",
    implementation: "SklearnCategoriser",
    from_date: "2025-01-01",
    to_date: "2025-12-31",
  },
  {
    url: "http://localhost:8000/api/categorisor/2/",
    id: 2,
    name: "other-model",
    implementation: "SklearnCategoriser",
    from_date: "2025-06-01",
    to_date: "2025-12-31",
  },
];

const mockPreviewResults = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      transaction: {
        id: 10,
        when: "2025-06-15T00:00:00Z",
        amount: "-42.50",
        description: "COLES SUPERMARKET",
        category: 3,
        category_name: "Shopping",
        account: 1,
      },
      current_category: { id: 3, name: "Shopping" },
      suggested_category: { id: 5, name: "Groceries", score: 92 },
    },
    {
      transaction: {
        id: 11,
        when: "2025-07-01T00:00:00Z",
        amount: "-15.00",
        description: "UBER TRIP",
        category: 8,
        category_name: "Other",
        account: 1,
      },
      current_category: { id: 8, name: "Other" },
      suggested_category: { id: 6, name: "Transport", score: 78 },
    },
  ],
};

function setup(mockAdapter: AxiosMockAdapter) {
  mockAdapter.onGet("/api/categorisor/").reply(200, mockModels);
  mockAdapter
    .onGet(/\/api\/categorisor\/1\/preview_recategorize\//)
    .reply(200, mockPreviewResults);
  mockAdapter
    .onPost("/api/categorisor/1/apply_recategorize/")
    .reply(200, { updated_count: 1 });
}

async function selectModelAndPreview(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => {
    expect(screen.getByText("Select a model...")).toBeTruthy();
  });

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "1" },
  });
  await user.click(screen.getByText("Preview Changes"));

  await waitFor(() => {
    expect(screen.getByText("COLES SUPERMARKET")).toBeTruthy();
  });
}

describe("Recategorise", () => {
  it("should render model dropdown with fetched models", async () => {
    renderWithProviders(<Recategorise />, undefined, setup);

    await waitFor(() => {
      expect(screen.getByText("test-model")).toBeTruthy();
      expect(screen.getByText("other-model")).toBeTruthy();
    });
  });

  it("should pre-fill date range from selected model", async () => {
    renderWithProviders(<Recategorise />, undefined, setup);

    await waitFor(() => {
      expect(screen.getByText("Select a model...")).toBeTruthy();
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    await waitFor(() => {
      expect(screen.getByLabelText("From date")).toHaveValue("2025-01-01");
      expect(screen.getByLabelText("To date")).toHaveValue("2025-12-31");
    });
  });

  it("should show preview table after selecting model and clicking Preview", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    expect(screen.getByText("COLES SUPERMARKET")).toBeTruthy();
    expect(screen.getByText("UBER TRIP")).toBeTruthy();
    expect(screen.getByText("Groceries")).toBeTruthy();
    expect(screen.getByText("Transport")).toBeTruthy();
    expect(screen.getByText("92%")).toBeTruthy();
    expect(screen.getByText("78%")).toBeTruthy();
  });

  it("should toggle row accept/reject on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    await user.click(firstRow);

    await waitFor(() => {
      expect(firstRow.className).toContain("table-success");
    });

    // Click again to reject
    await user.click(firstRow);

    await waitFor(() => {
      expect(firstRow.className).toContain("table-secondary");
    });
  });

  it("should toggle row with Space key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    // Focus index starts at 0 (first row). Press Space to accept.
    fireEvent.keyDown(document, { key: " " });

    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    await waitFor(() => {
      expect(firstRow.className).toContain("table-success");
    });
  });

  it("should navigate rows with arrow keys", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    // Initially first row has focus class
    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    const secondRow = screen.getByText("UBER TRIP").closest("tr")!;

    expect(firstRow.className).toContain("recategorise-focus-row");

    fireEvent.keyDown(document, { key: "ArrowDown" });

    await waitFor(() => {
      expect(secondRow.className).toContain("recategorise-focus-row");
      expect(firstRow.className).not.toContain("recategorise-focus-row");
    });
  });

  it("should accept all with 'a' key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    fireEvent.keyDown(document, { key: "a" });

    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    const secondRow = screen.getByText("UBER TRIP").closest("tr")!;

    await waitFor(() => {
      expect(firstRow.className).toContain("table-success");
      expect(secondRow.className).toContain("table-success");
    });
  });

  it("should reject all with 'n' key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    // First accept all, then reject all
    fireEvent.keyDown(document, { key: "a" });
    fireEvent.keyDown(document, { key: "n" });

    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    const secondRow = screen.getByText("UBER TRIP").closest("tr")!;

    await waitFor(() => {
      expect(firstRow.className).toContain("table-secondary");
      expect(secondRow.className).toContain("table-secondary");
    });
  });

  it("should apply only accepted changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    // Accept first row only via click
    const firstRow = screen.getByText("COLES SUPERMARKET").closest("tr")!;
    await user.click(firstRow);

    await waitFor(() => {
      expect(screen.getByText(/1 accepted/)).toBeTruthy();
    });

    await user.click(screen.getByText("Apply Changes"));

    await waitFor(() => {
      expect(
        screen.getByText("Successfully updated 1 transactions."),
      ).toBeTruthy();
    });
  });

  it("should disable Apply button when nothing accepted", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Recategorise />, undefined, setup);

    await selectModelAndPreview(user);

    const applyButton = screen.getByText("Apply Changes");
    expect(applyButton).toBeDisabled();
  });
});
