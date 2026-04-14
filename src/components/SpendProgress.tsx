import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";

import {
  PeriodFilters,
  createDefaultPeriodFilters,
} from "../data/TransactionFilters";
import { usePeriods } from "../hooks/usePeriods";
import { ProgressGroupBy, useProgress } from "../hooks/useProgress";
import {
  loadPeriodFiltersFromCookie,
  savePeriodFiltersToCookie,
} from "../utils/filterCookies";
import { SpendProgressTable } from "./SpendProgressTable";
import { TransactionFilterPeriods } from "./TransactionFilterPeriods";

export function SpendProgress(): JSX.Element | null {
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const [filters, setFilters] = useState<PeriodFilters>(() => {
    return loadPeriodFiltersFromCookie() ?? createDefaultPeriodFilters();
  });
  const [groupBy, setGroupBy] = useState<ProgressGroupBy>("category");
  const { isLoading: isProgressLoading, data: progress } = useProgress({
    from_date: filters.from_date,
    to_date: filters.to_date,
    group_by: groupBy,
  });

  useEffect(() => {
    savePeriodFiltersToCookie(filters);
  }, [filters]);

  if (isPeriodsLoading) {
    return null;
  }

  const handleUpdateFilters = (newFilters: Partial<PeriodFilters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div>
      <Container>
        <Row>
          <Col md={8}>
            {progress && <h2>{progress.period.label}</h2>}
            <ButtonGroup className="mb-3">
              <Button
                variant={
                  groupBy === "category" ? "primary" : "outline-primary"
                }
                onClick={() => setGroupBy("category")}
              >
                By Category
              </Button>
              <Button
                variant={
                  groupBy === "category_group" ? "primary" : "outline-primary"
                }
                onClick={() => setGroupBy("category_group")}
              >
                By Group
              </Button>
            </ButtonGroup>
            {progress && (
              <SpendProgressTable
                rows={progress.rows}
                totals={progress.totals}
              />
            )}
            {!progress && !isProgressLoading && (
              <p className="text-muted">
                Select a time period to view spend progress.
              </p>
            )}
          </Col>
          <Col md={2}>
            <div className="btn-group-vertical" role="group">
              <TransactionFilterPeriods
                filters={filters}
                periods={periods || []}
                updateFilters={handleUpdateFilters}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
