import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";

import { CrossValidateResult } from "../data/CrossValidation";

export interface CrossValidationResultsProps {
  result: CrossValidateResult;
  onSave: () => void;
}

const FAILED_PAGE_SIZE = 10;

const formatPercent = (value: number | undefined): string =>
  value === undefined ? "-" : `${(value * 100).toFixed(1)}%`;

const deltaClass = (value: number): string => {
  if (value > 0) return "text-success";
  if (value < 0) return "text-danger";
  return "";
};

const formatDelta = (value: number): string => {
  const pct = (value * 100).toFixed(1);
  const sign = value > 0 ? "+" : "";
  return `${sign}${pct}%`;
};

export function CrossValidationResults({
  result,
  onSave,
}: CrossValidationResultsProps): JSX.Element {
  const [failedPage, setFailedPage] = useState(0);

  useEffect(() => {
    setFailedPage(0);
  }, [result]);

  const sortedMetrics = [...result.category_metrics].sort(
    (a, b) => a.precision - b.precision,
  );

  const sortedFailed = [...result.failed].sort(
    (a, b) => b.modelled.score - a.modelled.score,
  );

  const totalFailedPages = Math.ceil(sortedFailed.length / FAILED_PAGE_SIZE);
  const pagedFailed = sortedFailed.slice(
    failedPage * FAILED_PAGE_SIZE,
    (failedPage + 1) * FAILED_PAGE_SIZE,
  );

  const hasAutoMetrics = sortedMetrics.some(
    (metric) => metric.auto_total !== undefined,
  );
  const hasCoverage = result.coverage !== undefined;
  const hasExclusions =
    result.excluded_categories !== undefined &&
    result.excluded_categories.length > 0;
  const comparison = result.comparison;

  return (
    <div>
      <Card className="mb-3">
        <Card.Header>Cross-Validation Results</Card.Header>
        <Card.Body>
          <Row>
            <Col sm={3}>
              <h4>{(result.accuracy * 100).toFixed(1)}%</h4>
              <p className="text-muted">Accuracy</p>
            </Col>
            <Col sm={3}>
              <h4>
                {result.matched} / {result.count}
              </h4>
              <p className="text-muted">Correct predictions</p>
            </Col>
            <Col sm={3}>
              <h4>{result.calibration_size}</h4>
              <p className="text-muted">Calibration set</p>
            </Col>
            <Col sm={3}>
              <h4>{result.validation_size}</h4>
              <p className="text-muted">Validation set</p>
            </Col>
          </Row>
          {hasCoverage && (
            <Row className="mt-3">
              <Col sm={4}>
                <h4>{formatPercent(result.coverage)}</h4>
                <p className="text-muted">Coverage</p>
              </Col>
              <Col sm={4}>
                <h4>{formatPercent(result.auto_precision)}</h4>
                <p className="text-muted">Auto-precision</p>
              </Col>
              <Col sm={4}>
                <h4>{result.review_count ?? "-"}</h4>
                <p className="text-muted">Review count</p>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {hasExclusions && (
        <Card className="mb-3">
          <Card.Header>Excluded Categories</Card.Header>
          <Card.Body>
            <p className="text-muted mb-2">
              Trained on {result.included_transaction_count} transactions across{" "}
              {result.included_category_count} categories.
            </p>
            <Table striped bordered hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {result.excluded_categories!.map((excluded) => (
                  <tr key={excluded.category_name}>
                    <td>{excluded.category_name}</td>
                    <td>{excluded.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {comparison && (
        <Card className="mb-3">
          <Card.Header>Baseline Comparison</Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm" className="mb-2">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>{result.implementation}</th>
                  <th>{comparison.baseline.implementation}</th>
                  <th>Δ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Accuracy</td>
                  <td>{formatPercent(result.accuracy)}</td>
                  <td>{formatPercent(comparison.baseline.accuracy)}</td>
                  <td className={deltaClass(comparison.delta.accuracy)}>
                    {formatDelta(comparison.delta.accuracy)}
                  </td>
                </tr>
                <tr>
                  <td>Overall accuracy</td>
                  <td>{formatPercent(result.overall_accuracy)}</td>
                  <td>
                    {formatPercent(comparison.baseline.overall_accuracy)}
                  </td>
                  <td className={deltaClass(comparison.delta.overall_accuracy)}>
                    {formatDelta(comparison.delta.overall_accuracy)}
                  </td>
                </tr>
                <tr>
                  <td>Auto-precision</td>
                  <td>{formatPercent(result.auto_precision)}</td>
                  <td>{formatPercent(comparison.baseline.auto_precision)}</td>
                  <td className={deltaClass(comparison.delta.auto_precision)}>
                    {formatDelta(comparison.delta.auto_precision)}
                  </td>
                </tr>
                <tr>
                  <td>Coverage</td>
                  <td>{formatPercent(result.coverage)}</td>
                  <td>{formatPercent(comparison.baseline.coverage)}</td>
                  <td className={deltaClass(comparison.delta.coverage)}>
                    {formatDelta(comparison.delta.coverage)}
                  </td>
                </tr>
              </tbody>
            </Table>
            <p className="text-muted mb-0">
              Baseline review count: {comparison.baseline.review_count}
            </p>
          </Card.Body>
        </Card>
      )}

      <h5>Per-Category Precision</h5>
      <Table striped bordered hover size="sm" className="mb-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Correct</th>
            <th>Total</th>
            <th>Precision</th>
            {hasAutoMetrics && (
              <>
                <th>Auto-precision</th>
                <th>Coverage</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedMetrics.map((metric) => (
            <tr key={metric.category_name}>
              <td>{metric.category_name}</td>
              <td>{metric.correct}</td>
              <td>{metric.total}</td>
              <td>{(metric.precision * 100).toFixed(1)}%</td>
              {hasAutoMetrics && (
                <>
                  <td>
                    {metric.auto_total !== undefined
                      ? formatPercent(metric.auto_precision)
                      : ""}
                  </td>
                  <td>
                    {metric.auto_total !== undefined
                      ? formatPercent(metric.coverage)
                      : ""}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {sortedFailed.length > 0 && (
        <Accordion className="mb-3">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Failed Predictions ({sortedFailed.length})
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actual</th>
                    <th>Predicted</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedFailed.map((item) => (
                    <tr key={item.transaction.id}>
                      <td>{item.transaction.description}</td>
                      <td>{item.transaction.amount}</td>
                      <td>{item.transaction.category_name}</td>
                      <td>{item.modelled.name}</td>
                      <td>{item.modelled.score.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalFailedPages > 1 && (
                <div className="d-flex align-items-center gap-2">
                  <Pagination className="mb-0" aria-label="Failed predictions pagination">
                    <Pagination.Prev
                      disabled={failedPage === 0}
                      onClick={() => setFailedPage(failedPage - 1)}
                    />
                    <Pagination.Next
                      disabled={failedPage >= totalFailedPages - 1}
                      onClick={() => setFailedPage(failedPage + 1)}
                    />
                  </Pagination>
                  <span className="text-muted">
                    {failedPage * FAILED_PAGE_SIZE + 1}-
                    {Math.min(
                      (failedPage + 1) * FAILED_PAGE_SIZE,
                      sortedFailed.length,
                    )}{" "}
                    of {sortedFailed.length}
                  </span>
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      <Button variant="success" onClick={onSave}>
        Save Model
      </Button>
    </div>
  );
}
