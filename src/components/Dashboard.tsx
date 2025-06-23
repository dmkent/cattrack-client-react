import React, { useState } from "react";
import PlotlyPie from "./PlotlyPie";
import { Grid, Col, Row } from "react-bootstrap";

import TransactionFilterPeriods from "./TransactionFilterPeriods";
import usePeriods from "../hooks/usePeriods";
import useTransactionSummary from "../hooks/useTransactionSummary";
import { PeriodFilters } from "./TransactionFilters";

interface DashboardProps {}

function Dashboard(props: DashboardProps): JSX.Element | null {
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const [filters, setFilters] = useState<PeriodFilters>({ to_date: null, from_date: null });
  const { isLoading: isSummaryLoading, data: summary } =
    useTransactionSummary(filters);

  if (isPeriodsLoading || isSummaryLoading || summary === undefined) {
    return null;
  }

  const handleUpdateFilters = (newFilters: Partial<PeriodFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div>
      <Grid>
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
      </Grid>
    </div>
  );
}

export default Dashboard;