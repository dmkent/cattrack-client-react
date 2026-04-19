import { useEffect, useMemo } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

import CONFIG from "ctrack_config";

import { Budget, BudgetInput, categoryIdFromUrl } from "../data/Budget";
import { Category } from "../data/Category";

export interface BudgetFormValues {
  amount: string;
  valid_from: string;
  valid_to: string;
  category_ids: string[];
}

export interface BudgetFormModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (input: BudgetInput) => Promise<void> | void;
  budget?: Budget | null;
  categories: Category[];
  isSaving: boolean;
  error?: string;
}

function categoryUrlForId(id: string): string {
  return `${CONFIG.API_URI}/api/categories/${id}/`;
}

function defaultValuesFor(budget: Budget | null | undefined): BudgetFormValues {
  if (!budget) {
    const today = new Date();
    const yearStart = `${today.getFullYear()}-01-01`;
    const yearEnd = `${today.getFullYear()}-12-31`;
    return {
      amount: "",
      valid_from: yearStart,
      valid_to: yearEnd,
      category_ids: [],
    };
  }
  return {
    amount: budget.amount,
    valid_from: budget.valid_from,
    valid_to: budget.valid_to,
    category_ids: budget.categories
      .map((url) => categoryIdFromUrl(url))
      .filter((id): id is number => id !== null)
      .map((id) => String(id)),
  };
}

export function BudgetFormModal({
  show,
  onHide,
  onSave,
  budget,
  categories,
  isSaving,
  error,
}: BudgetFormModalProps): JSX.Element {
  const defaults = useMemo(() => defaultValuesFor(budget), [budget]);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BudgetFormValues>({ defaultValues: defaults });

  useEffect(() => {
    if (show) {
      reset(defaults);
    }
  }, [show, defaults, reset]);

  const onFormSubmit: SubmitHandler<BudgetFormValues> = (data) => {
    const input: BudgetInput = {
      amount: data.amount,
      valid_from: data.valid_from,
      valid_to: data.valid_to,
      categories: (data.category_ids ?? []).map(categoryUrlForId),
    };
    return onSave(input);
  };

  const title = budget ? "Edit Budget" : "Add Budget";

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="budget_amount">
            <Form.Label>Monthly amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              {...register("amount", {
                required: "Amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Enter a non-negative decimal value",
                },
              })}
              isInvalid={!!errors.amount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="budget_valid_from">
                <Form.Label>Valid from</Form.Label>
                <Form.Control
                  type="date"
                  {...register("valid_from", {
                    required: "Start date is required",
                  })}
                  isInvalid={!!errors.valid_from}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.valid_from?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="budget_valid_to">
                <Form.Label>Valid to</Form.Label>
                <Form.Control
                  type="date"
                  {...register("valid_to", {
                    required: "End date is required",
                    validate: (value) => {
                      const from = getValues("valid_from");
                      if (!from || !value) return true;
                      return (
                        value >= from ||
                        "End date must be on or after start date"
                      );
                    },
                  })}
                  isInvalid={!!errors.valid_to}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.valid_to?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="budget_categories">
            <Form.Label>Categories</Form.Label>
            <div
              className="border rounded p-2"
              style={{ maxHeight: "220px", overflowY: "auto" }}
            >
              {categories.length === 0 && (
                <span className="text-muted">No categories available</span>
              )}
              {categories.map((category) => (
                <Form.Check
                  key={category.id}
                  type="checkbox"
                  id={`budget_category_${category.id}`}
                  label={category.name}
                  value={category.id}
                  {...register("category_ids", {
                    validate: (value) =>
                      (value && value.length > 0) ||
                      "Select at least one category",
                  })}
                />
              ))}
            </div>
            {errors.category_ids && (
              <div className="invalid-feedback d-block">
                {errors.category_ids.message as string}
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving || categories.length === 0}
          >
            {isSaving && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-label="Saving"
                className="me-2"
              />
            )}
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
