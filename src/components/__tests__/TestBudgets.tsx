import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { renderWithProviders } from "../../RenderWithProviders";
import { Budget } from "../../data/Budget";
import { Budgets } from "../Budgets";

const categories = [
  { url: "http://localhost:8000/api/categories/5/", id: 5, name: "Groceries" },
  { url: "http://localhost:8000/api/categories/8/", id: 8, name: "Utilities" },
  {
    url: "http://localhost:8000/api/categories/12/",
    id: 12,
    name: "Entertainment",
  },
];

const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

const existingBudgets: Budget[] = [
  {
    url: "http://localhost:8000/api/budget/1/",
    id: 1,
    pretty_name: "Groceries",
    amount: "500.00",
    valid_from: `${currentYear}-01-01`,
    valid_to: `${currentYear}-12-31`,
    categories: ["http://localhost:8000/api/categories/5/"],
  },
  {
    url: "http://localhost:8000/api/budget/2/",
    id: 2,
    pretty_name: "Utilities",
    amount: "150.00",
    valid_from: `${currentYear}-01-01`,
    valid_to: `${currentYear}-12-31`,
    categories: ["http://localhost:8000/api/categories/8/"],
  },
  {
    url: "http://localhost:8000/api/budget/3/",
    id: 3,
    pretty_name: "Old Entertainment",
    amount: "80.00",
    valid_from: `${previousYear}-01-01`,
    valid_to: `${previousYear}-12-31`,
    categories: ["http://localhost:8000/api/categories/12/"],
  },
];

const confirmSpy = vi.fn();

beforeEach(() => {
  confirmSpy.mockReset();
  confirmSpy.mockReturnValue(true);
  vi.stubGlobal("confirm", confirmSpy);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderBudgets(options?: {
  onPost?: (body: unknown) => [number, unknown];
  onPut?: (id: string, body: unknown) => [number, unknown];
  onDelete?: (id: string) => [number, unknown];
}) {
  return renderWithProviders(<Budgets />, undefined, (mock) => {
    mock.onGet("/api/budget/").reply(200, existingBudgets);
    mock.onGet("/api/categories/").reply(200, categories);

    mock.onPost("/api/budget/").reply((config) => {
      const body = JSON.parse(config.data ?? "{}");
      return options?.onPost?.(body) ?? [201, { id: 99, ...body }];
    });

    mock.onPut(/\/api\/budget\/(\d+)\//).reply((config) => {
      const match = config.url?.match(/\/api\/budget\/(\d+)\//);
      const id = match?.[1] ?? "";
      const body = JSON.parse(config.data ?? "{}");
      return options?.onPut?.(id, body) ?? [200, { id: Number(id), ...body }];
    });

    mock.onDelete(/\/api\/budget\/(\d+)\//).reply((config) => {
      const match = config.url?.match(/\/api\/budget\/(\d+)\//);
      const id = match?.[1] ?? "";
      return options?.onDelete?.(id) ?? [204];
    });
  });
}

describe("Budgets", () => {
  test("renders existing budgets in a table", async () => {
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Edit budget Utilities" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`${currentYear}-01-01`).length,
    ).toBeGreaterThan(0);
  });

  test("filters out budgets outside the current year by default", async () => {
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Edit budget Old Entertainment" }),
    ).not.toBeInTheDocument();
  });

  test("shows budgets from a previous year via shortcut", async () => {
    const user = userEvent.setup();
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Previous Year" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Old Entertainment" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Edit budget Groceries" }),
    ).not.toBeInTheDocument();
  });

  test("'All' shortcut shows every budget", async () => {
    const user = userEvent.setup();
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "All" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Old Entertainment" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Edit budget Groceries" }),
    ).toBeInTheDocument();
  });

  test("manual date inputs narrow the results", async () => {
    const user = userEvent.setup();
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filter valid from"), {
      target: { value: `${previousYear}-06-01` },
    });
    fireEvent.change(screen.getByLabelText("Filter valid to"), {
      target: { value: `${previousYear}-12-31` },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Old Entertainment" }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Edit budget Groceries" }),
    ).not.toBeInTheDocument();
  });

  test("shows friendly message when no budgets match filter", async () => {
    const user = userEvent.setup();
    renderBudgets();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Filter valid from"), {
      target: { value: "2030-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Filter valid to"), {
      target: { value: "2030-12-31" },
    });

    await waitFor(() => {
      expect(
        screen.getByText("No budgets match the selected period."),
      ).toBeInTheDocument();
    });
  });

  test("shows empty state message when no budgets", async () => {
    renderWithProviders(<Budgets />, undefined, (mock) => {
      mock.onGet("/api/budget/").reply(200, []);
      mock.onGet("/api/categories/").reply(200, categories);
    });

    await waitFor(() => {
      expect(screen.getByText("No budgets defined yet.")).toBeInTheDocument();
    });
  });

  test("creates a new budget via modal", async () => {
    const user = userEvent.setup();
    let postedBody: Record<string, unknown> | null = null;
    renderBudgets({
      onPost: (body) => {
        postedBody = body as Record<string, unknown>;
        return [201, { id: 42, ...(body as object) }];
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Add Budget/i }));

    const dialog = await screen.findByRole("dialog");

    await user.clear(within(dialog).getByLabelText("Monthly amount"));
    await user.type(within(dialog).getByLabelText("Monthly amount"), "250.50");
    await user.click(within(dialog).getByLabelText("Entertainment"));
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(postedBody).not.toBeNull();
    });

    expect(postedBody).toMatchObject({
      amount: "250.5",
      categories: ["http://localhost:8000/api/categories/12/"],
    });
  });

  test("edits an existing budget", async () => {
    const user = userEvent.setup();
    let putId: string | null = null;
    let putBody: Record<string, unknown> | null = null;
    renderBudgets({
      onPut: (id, body) => {
        putId = id;
        putBody = body as Record<string, unknown>;
        return [200, { id: Number(id), ...(body as object) }];
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Edit budget Groceries" }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Edit budget Groceries" }),
    );

    const dialog = await screen.findByRole("dialog");
    const amountInput = within(dialog).getByLabelText("Monthly amount");
    await user.clear(amountInput);
    await user.type(amountInput, "600.00");
    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(putId).toBe("1");
    });
    expect(putBody).toMatchObject({ amount: "600" });
  });

  test("deletes a budget after confirmation", async () => {
    const user = userEvent.setup();
    let deletedId: string | null = null;
    renderBudgets({
      onDelete: (id) => {
        deletedId = id;
        return [204];
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete budget Utilities" }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Delete budget Utilities" }),
    );

    await waitFor(() => {
      expect(deletedId).toBe("2");
    });
    expect(confirmSpy).toHaveBeenCalled();
  });

  test("does not delete when confirmation is cancelled", async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    let deletedId: string | null = null;
    renderBudgets({
      onDelete: (id) => {
        deletedId = id;
        return [204];
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Delete budget Utilities" }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Delete budget Utilities" }),
    );

    expect(deletedId).toBeNull();
  });
});
