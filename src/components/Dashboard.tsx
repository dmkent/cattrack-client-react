import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { PeriodFilters } from "../data/TransactionFilters";
import { usePeriods } from "../hooks/usePeriods";
import { useTransactionSummaries } from "../hooks/useTransactionSummary";
import { PlotlyPie } from "./PlotlyPie";
import { TransactionFilterPeriods } from "./TransactionFilterPeriods";

export function Dashboard(): JSX.Element | null {
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const [filters, setFilters] = useState<PeriodFilters>({
    to_date: null,
    from_date: null,
  });
  const { isLoading: isSummaryLoading, data: summary } =
    useTransactionSummaries(filters);

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
            <PlotlyPie summary={summary} />
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
