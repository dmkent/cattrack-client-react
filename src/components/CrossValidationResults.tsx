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
        </Card.Body>
      </Card>

      <h5>Per-Category Precision</h5>
      <Table striped bordered hover size="sm" className="mb-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Correct</th>
            <th>Total</th>
            <th>Precision</th>
          </tr>
        </thead>
        <tbody>
          {sortedMetrics.map((metric) => (
            <tr key={metric.category_name}>
              <td>{metric.category_name}</td>
              <td>{metric.correct}</td>
              <td>{metric.total}</td>
              <td>{(metric.precision * 100).toFixed(1)}%</td>
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
