import { useEffect, useState } from "react";
import { Container, Col, Row, ButtonGroup, Button } from "react-bootstrap";

import {
  PeriodFilters,
  createDefaultPeriodFilters,
} from "../data/TransactionFilters";
import { usePeriods } from "../hooks/usePeriods";
import { useTransactionSummaries } from "../hooks/useTransactionSummary";
import {
  loadPeriodFiltersFromCookie,
  savePeriodFiltersToCookie,
} from "../utils/filterCookies";
import { CategoryAveragesTable } from "./CategoryAveragesTable";
import { PlotlyPie } from "./PlotlyPie";
import { TransactionFilterPeriods } from "./TransactionFilterPeriods";

type ViewMode = "plot" | "table";

export function Dashboard(): JSX.Element | null {
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const [filters, setFilters] = useState<PeriodFilters>(() => {
    return loadPeriodFiltersFromCookie() ?? createDefaultPeriodFilters();
  });
  const [viewMode, setViewMode] = useState<ViewMode>("plot");
  const { isLoading: isSummaryLoading, data: summary } =
    useTransactionSummaries(filters);

  useEffect(() => {
    savePeriodFiltersToCookie(filters);
  }, [filters]);

  if (isPeriodsLoading || isSummaryLoading || summary === undefined) {
    return null;
  }

  const handleUpdateFilters = (newFilters: Partial<PeriodFilters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div>
      <Container>
        <Row>
          {/*
          <Col md={6}>
            <BudgetSummary from_date={filters.from_date} to_date={filters.to_date}/>
          </Col>
          <Col md={6}>
            <Well>TODO: put upcoming bills here</Well>
          </Col>
        */}
        </Row>
        <Row>
          <Col md={8}>
            <ButtonGroup className="mb-3">
              <Button
                variant={viewMode === "plot" ? "primary" : "outline-primary"}
                onClick={() => setViewMode("plot")}
              >
                Plot View
              </Button>
              <Button
                variant={viewMode === "table" ? "primary" : "outline-primary"}
                onClick={() => setViewMode("table")}
              >
                Table View
              </Button>
            </ButtonGroup>
            {viewMode === "plot" ? (
              <PlotlyPie summary={summary} />
            ) : (
              <CategoryAveragesTable summary={summary} filters={filters} />
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
