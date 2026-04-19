import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { Alert, Button, ButtonGroup, Form, Table } from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import { Budget, BudgetInput, categoryIdFromUrl } from "../data/Budget";
import { Category } from "../data/Category";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { useUpdateBudgets } from "../hooks/useUpdateBudgets";
import { BudgetFormModal } from "./BudgetFormModal";

interface DateRange {
  from_date: string | null;
  to_date: string | null;
}

function currentYearRange(): DateRange {
  const year = new Date().getFullYear();
  return { from_date: `${year}-01-01`, to_date: `${year}-12-31` };
}

function previousYearRange(): DateRange {
  const year = new Date().getFullYear() - 1;
  return { from_date: `${year}-01-01`, to_date: `${year}-12-31` };
}

function nextYearRange(): DateRange {
  const year = new Date().getFullYear() + 1;
  return { from_date: `${year}-01-01`, to_date: `${year}-12-31` };
}

function currentMonthRange(): DateRange {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const fmt = (d: Date) => {
    const monthPart = String(d.getMonth() + 1).padStart(2, "0");
    const dayPart = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${monthPart}-${dayPart}`;
  };
  return { from_date: fmt(start), to_date: fmt(end) };
}

function overlapsRange(budget: Budget, range: DateRange): boolean {
  if (range.from_date !== null && budget.valid_to < range.from_date) {
    return false;
  }
  if (range.to_date !== null && budget.valid_from > range.to_date) {
    return false;
  }
  return true;
}

function rangesEqual(a: DateRange, b: DateRange): boolean {
  return a.from_date === b.from_date && a.to_date === b.to_date;
}

function categoryNames(budget: Budget, categories: Category[]): string {
  const byId = new Map(categories.map((c) => [String(c.id), c.name]));
  const names = budget.categories
    .map((url) => categoryIdFromUrl(url))
    .filter((id): id is number => id !== null)
    .map((id) => byId.get(String(id)) ?? `#${id}`);
  return names.join(", ");
}

export function Budgets(): JSX.Element | null {
  const {
    isLoading: isLoadingBudgets,
    data: budgets,
    isError: isBudgetsError,
  } = useBudgets();
  const {
    isLoading: isLoadingCategories,
    data: categories,
    isError: isCategoriesError,
  } = useCategories();
  const { createBudget, updateBudget, deleteBudget } = useUpdateBudgets();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [pageError, setPageError] = useState<string | null>(null);
  const [filterRange, setFilterRange] = useState<DateRange>(() =>
    currentYearRange(),
  );

  const categoriesList = useMemo(
    () => [...(categories ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  const filteredBudgets = useMemo(
    () => (budgets ?? []).filter((b) => overlapsRange(b, filterRange)),
    [budgets, filterRange],
  );

  if (isLoadingBudgets || isLoadingCategories) {
    return null;
  }

  if (isBudgetsError || isCategoriesError) {
    return (
      <Alert variant="danger">
        Failed to load budgets data. Please refresh and try again.
      </Alert>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setSaveError(undefined);
    setShowModal(true);
  };

  const openEdit = (budget: Budget) => {
    setEditing(budget);
    setSaveError(undefined);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSaveError(undefined);
  };

  const handleSave = async (input: BudgetInput) => {
    setIsSaving(true);
    setSaveError(undefined);
    try {
      if (editing) {
        await updateBudget(editing.id, input);
      } else {
        await createBudget(input);
      }
      setShowModal(false);
      setEditing(null);
    } catch (e: unknown) {
      setSaveError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (budget: Budget) => {
    const confirmed = window.confirm(
      `Delete budget "${budget.pretty_name}"?`,
    );
    if (!confirmed) return;
    setPageError(null);
    try {
      await deleteBudget(budget.id);
    } catch (e: unknown) {
      setPageError((e as Error).message);
    }
  };

  const shortcuts: { label: string; range: DateRange }[] = [
    { label: "All", range: { from_date: null, to_date: null } },
    { label: "Current Year", range: currentYearRange() },
    { label: "Previous Year", range: previousYearRange() },
    { label: "Next Year", range: nextYearRange() },
    { label: "Current Month", range: currentMonthRange() },
  ];

  return (
    <div>
      <h2>
        Budgets{" "}
        <Button variant="outline-secondary" size="sm" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Add Budget
        </Button>
      </h2>
      {pageError && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setPageError(null)}
        >
          {pageError}
        </Alert>
      )}
      <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
        <Form.Group controlId="budget_filter_from">
          <Form.Label className="mb-1">Valid from (or later)</Form.Label>
          <Form.Control
            type="date"
            aria-label="Filter valid from"
            value={filterRange.from_date ?? ""}
            max={filterRange.to_date ?? undefined}
            onChange={(e) =>
              setFilterRange((prev) => ({
                ...prev,
                from_date: e.target.value || null,
              }))
            }
          />
        </Form.Group>
        <Form.Group controlId="budget_filter_to">
          <Form.Label className="mb-1">Valid to (or earlier)</Form.Label>
          <Form.Control
            type="date"
            aria-label="Filter valid to"
            value={filterRange.to_date ?? ""}
            min={filterRange.from_date ?? undefined}
            onChange={(e) =>
              setFilterRange((prev) => ({
                ...prev,
                to_date: e.target.value || null,
              }))
            }
          />
        </Form.Group>
        <ButtonGroup size="sm" aria-label="Budget date shortcuts">
          {shortcuts.map((shortcut) => (
            <Button
              key={shortcut.label}
              variant="outline-secondary"
              active={rangesEqual(filterRange, shortcut.range)}
              onClick={() => setFilterRange(shortcut.range)}
            >
              {shortcut.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Categories</th>
            <th>Monthly amount</th>
            <th>Valid from</th>
            <th>Valid to</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredBudgets.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                {(budgets ?? []).length === 0
                  ? "No budgets defined yet."
                  : "No budgets match the selected period."}
              </td>
            </tr>
          )}
          {filteredBudgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.pretty_name}</td>
              <td>{categoryNames(budget, categoriesList)}</td>
              <td>
                <FormattedNumber
                  value={Math.abs(parseFloat(budget.amount))}
                  style="currency"
                  currency="AUD"
                />
              </td>
              <td>{budget.valid_from}</td>
              <td>{budget.valid_to}</td>
              <td className="text-end text-nowrap">
                <ButtonGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    onClick={() => openEdit(budget)}
                    aria-label={`Edit budget ${budget.pretty_name}`}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(budget)}
                    aria-label={`Delete budget ${budget.pretty_name}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <BudgetFormModal
        show={showModal}
        onHide={closeModal}
        onSave={handleSave}
        budget={editing}
        categories={categoriesList}
        isSaving={isSaving}
        error={saveError}
      />
    </div>
  );
}
