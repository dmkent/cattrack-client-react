import {
  faCheck,
  faXmark,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  FormSelect,
  Pagination,
} from "react-bootstrap";
import { FormattedDate, FormattedNumber } from "react-intl";

import { RecategorisePreviewItem, RecategoriseUpdate } from "../data/Recategorise";
import {
  useCategorisorModels,
  useRecategorisePreview,
  useApplyRecategorise,
} from "../hooks/useRecategorise";

interface Decision {
  accepted: boolean;
  categoryId: number;
}

const PAGE_SIZE = 100;

export function Recategorise(): JSX.Element | null {
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [previewModelId, setPreviewModelId] = useState<number | null>(null);
  const [previewFromDate, setPreviewFromDate] = useState("");
  const [previewToDate, setPreviewToDate] = useState("");
  const [page, setPage] = useState(1);
  const [focusIndex, setFocusIndex] = useState(0);
  const [decisions, setDecisions] = useState<Map<number, Decision>>(new Map());
  const [isApplying, setIsApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const { data: models, isLoading: modelsLoading } = useCategorisorModels();
  const { data: previewData, isLoading: previewLoading } =
    useRecategorisePreview(previewModelId, previewFromDate, previewToDate, page);
  const { applyRecategorise } = useApplyRecategorise();

  const results = previewData?.results ?? [];
  const totalCount = previewData?.count ?? 0;
  const numPages = Math.ceil(totalCount / PAGE_SIZE);

  const getDecision = useCallback(
    (transactionId: number): Decision | undefined => decisions.get(transactionId),
    [decisions],
  );

  const toggleDecision = useCallback(
    (item: RecategorisePreviewItem) => {
      setDecisions((prev) => {
        const next = new Map(prev);
        const current = next.get(item.transaction.id);
        if (current === undefined || !current.accepted) {
          next.set(item.transaction.id, {
            accepted: true,
            categoryId: item.suggested_category.id,
          });
        } else {
          next.set(item.transaction.id, {
            accepted: false,
            categoryId: item.suggested_category.id,
          });
        }
        return next;
      });
    },
    [],
  );

  const setAllOnPage = useCallback(
    (accepted: boolean) => {
      setDecisions((prev) => {
        const next = new Map(prev);
        for (const item of results) {
          next.set(item.transaction.id, {
            accepted,
            categoryId: item.suggested_category.id,
          });
        }
        return next;
      });
    },
    [results],
  );

  // Keyboard shortcuts
  useEffect(() => {
    if (!previewModelId || results.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((prev) => Math.max(prev - 1, 0));
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          if (results[focusIndex]) {
            toggleDecision(results[focusIndex]);
          }
          break;
        case "a":
          e.preventDefault();
          setAllOnPage(true);
          break;
        case "n":
          e.preventDefault();
          setAllOnPage(false);
          break;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [previewModelId, results, focusIndex, toggleDecision, setAllOnPage]);

  // Scroll focused row into view
  useEffect(() => {
    rowRefs.current[focusIndex]?.scrollIntoView?.({ block: "nearest" });
  }, [focusIndex]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFocusIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreview = () => {
    if (selectedModelId === null || !fromDate || !toDate) return;
    setPreviewModelId(selectedModelId);
    setPreviewFromDate(fromDate);
    setPreviewToDate(toDate);
    setPage(1);
    setFocusIndex(0);
    setDecisions(new Map());
    setApplyResult(null);
    setError(null);
  };

  const handleApply = async () => {
    if (previewModelId === null) return;

    const updates: RecategoriseUpdate[] = [];
    decisions.forEach((decision, transactionId) => {
      if (decision.accepted) {
        updates.push({ transaction: transactionId, category: decision.categoryId });
      }
    });

    if (updates.length === 0) return;

    setIsApplying(true);
    setError(null);
    setApplyResult(null);

    try {
      let totalUpdated = 0;
      // Chunk into batches of 500; only invalidate queries on the final batch
      for (let i = 0; i < updates.length; i += 500) {
        const batch = updates.slice(i, i + 500);
        const isLastBatch = i + 500 >= updates.length;
        const result = await applyRecategorise(previewModelId, batch, {
          invalidate: isLastBatch,
        });
        totalUpdated += result.updated_count;
      }
      setApplyResult(totalUpdated);
      setDecisions(new Map());
    } catch {
      setError("Failed to apply recategorisation. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (modelsLoading) return null;

  const acceptedCount = Array.from(decisions.values()).filter(
    (d) => d.accepted,
  ).length;

  const paginationProps = (active: boolean) => ({
    linkClassName: active ? "link-muted" : "link-secondary",
  });

  function scoreBadgeVariant(score: number): string {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "danger";
  }

  function rowClassName(item: RecategorisePreviewItem, index: number): string {
    const classes: string[] = [];
    const decision = getDecision(item.transaction.id);
    if (decision?.accepted === true) {
      classes.push("table-success");
    } else if (decision?.accepted === false) {
      classes.push("table-secondary");
    }
    if (index === focusIndex && previewModelId !== null) {
      classes.push("recategorise-focus-row");
    }
    return classes.join(" ");
  }

  return (
    <div>
      <h3>Recategorise</h3>

      {/* Model selector */}
      <div className="row mb-3">
        <div className="col-md-4">
          <FormSelect
            value={selectedModelId ?? ""}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              setSelectedModelId(id);
              const model = models?.find((m) => m.id === id);
              if (model) {
                setFromDate(model.from_date);
                setToDate(model.to_date);
              }
            }}
          >
            <option value="">Select a model...</option>
            {models?.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </FormSelect>
        </div>
        <div className="col-md-2">
          <Form.Label htmlFor="from-date" className="visually-hidden">
            From date
          </Form.Label>
          <input
            id="from-date"
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
          />
        </div>
        <div className="col-md-2">
          <Form.Label htmlFor="to-date" className="visually-hidden">
            To date
          </Form.Label>
          <input
            id="to-date"
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
          />
        </div>
        <div className="col-auto">
          <Button
            variant="dark"
            onClick={handlePreview}
            disabled={selectedModelId === null || !fromDate || !toDate || previewLoading}
          >
            Preview Changes
          </Button>
        </div>
      </div>

      {/* Results */}
      {applyResult !== null && (
        <Alert variant="success">
          Successfully updated {applyResult} transactions.
        </Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {previewModelId !== null && previewData && (
        <>
          {/* Summary and apply */}
          <div className="d-flex align-items-center mb-2 gap-3">
            <span className="text-muted">
              {totalCount} predicted changes &middot; {acceptedCount} accepted
            </span>
            <Button
              variant="dark"
              size="sm"
              onClick={handleApply}
              disabled={isApplying || acceptedCount === 0}
            >
              {isApplying ? "Applying..." : "Apply Changes"}
            </Button>
          </div>

          {/* Preview table */}
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                  <th>Current</th>
                  <th>Suggested</th>
                  <th>Score</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => {
                  const decision = getDecision(item.transaction.id);
                  let description = item.transaction.description ?? "";
                  if (description.length > 50) {
                    description = description.substring(0, 50) + "...";
                  }
                  return (
                    <tr
                      key={item.transaction.id}
                      ref={(el) => { rowRefs.current[index] = el; }}
                      className={rowClassName(item, index)}
                      onClick={() => toggleDecision(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleDecision(item);
                        }
                      }}
                      tabIndex={0}
                      aria-pressed={
                        decision === undefined
                          ? "mixed"
                          : decision.accepted
                            ? "true"
                            : "false"
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <FormattedDate value={item.transaction.when} />
                      </td>
                      <td title={item.transaction.description}>
                        {description}
                      </td>
                      <td className="text-end">
                        <span
                          className={
                            Number(item.transaction.amount) < 0
                              ? "text-danger"
                              : undefined
                          }
                        >
                          <FormattedNumber
                            value={Number(item.transaction.amount)}
                            style="currency"
                            currency="AUD"
                          />
                        </span>
                      </td>
                      <td>
                        <span className="badge text-bg-secondary">
                          {item.current_category.name ?? "Uncategorised"}
                        </span>
                      </td>
                      <td>
                        <span className="badge text-bg-primary">
                          {item.suggested_category.name}
                        </span>
                      </td>
                      <td>
                        <Badge bg={scoreBadgeVariant(item.suggested_category.score)}>
                          {item.suggested_category.score}%
                        </Badge>
                      </td>
                      <td className="text-center">
                        {decision === undefined && (
                          <FontAwesomeIcon icon={faMinus} className="text-muted" />
                        )}
                        {decision?.accepted === true && (
                          <FontAwesomeIcon icon={faCheck} className="text-success" />
                        )}
                        {decision?.accepted === false && (
                          <FontAwesomeIcon icon={faXmark} className="text-danger" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Keyboard legend */}
          <p className="text-muted small mb-2">
            <kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate &middot;{" "}
            <kbd>Space</kbd> Toggle &middot;{" "}
            <kbd>A</kbd> Accept All &middot;{" "}
            <kbd>N</kbd> Reject All
          </p>

          {/* Pagination */}
          {numPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                {...paginationProps(false)}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                {...paginationProps(false)}
              />
              {Array.from({ length: Math.min(5, numPages) }, (_, i) => {
                const firstPage = Math.max(0, Math.min(page - 3, numPages - 5));
                const p = firstPage + i + 1;
                if (p > numPages) return null;
                return (
                  <Pagination.Item
                    key={p}
                    active={p === page}
                    onClick={() => handlePageChange(p)}
                    {...paginationProps(p === page)}
                  >
                    {p}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => handlePageChange(Math.min(numPages, page + 1))}
                {...paginationProps(false)}
              />
              <Pagination.Last
                onClick={() => handlePageChange(numPages)}
                {...paginationProps(false)}
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
