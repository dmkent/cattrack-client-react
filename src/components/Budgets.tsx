import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import { Budget, BudgetInput, categoryIdFromUrl } from "../data/Budget";
import { Category } from "../data/Category";
import { useBudgets } from "../hooks/useBudgets";
import { useCategories } from "../hooks/useCategories";
import { useUpdateBudgets } from "../hooks/useUpdateBudgets";
import { BudgetFormModal } from "./BudgetFormModal";

function formatDate(date: string): string {
  return date;
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
  const { isLoading: isLoadingBudgets, data: budgets } = useBudgets();
  const { isLoading: isLoadingCategories, data: categories } = useCategories();
  const { createBudget, updateBudget, deleteBudget } = useUpdateBudgets();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [pageError, setPageError] = useState<string | null>(null);

  const categoriesList = useMemo(
    () => [...(categories ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );

  if (isLoadingBudgets || isLoadingCategories) {
    return null;
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
          {(budgets ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No budgets defined yet.
              </td>
            </tr>
          )}
          {(budgets ?? []).map((budget) => (
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
              <td>{formatDate(budget.valid_from)}</td>
              <td>{formatDate(budget.valid_to)}</td>
              <td className="text-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => openEdit(budget)}
                  aria-label={`Edit budget ${budget.pretty_name}`}
                >
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(budget)}
                  aria-label={`Delete budget ${budget.pretty_name}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
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
