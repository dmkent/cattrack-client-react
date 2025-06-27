import React from "react";
import { Button } from "react-bootstrap";
import { Period } from "src/data/Period";
import { PeriodFilters } from "./TransactionFilters";

interface TransactionFilterPeriodsProps {
  filters: PeriodFilters;
  updateFilters: (filters: Partial<PeriodFilters>) => void;
  periods: Period[];
}

function TransactionFilterPeriods(props: TransactionFilterPeriodsProps) {
  const { filters, updateFilters, periods } = props;

  let all_periods = filters.from_date === null && filters.to_date === null;

  return (
    <div>
      <h3 data-testid="dateRangePicker">Time</h3>
      <input
        aria-label="Date from"
        max={filters.to_date ?? undefined}
        min={undefined}
        type="date"
        value={filters.from_date ?? ""}
        onChange={(e) => updateFilters({ from_date: e.target.value })}
      />
      <input
        aria-label="Date to"
        max={undefined}
        min={filters.from_date ?? undefined}
        type="date"
        value={filters.to_date ?? ""}
        onChange={(e) => updateFilters({ to_date: e.target.value })}
      />
      <p>-- OR --</p>
      <div className="btn-group-vertical" role="group">
        <Button
          className="btn btn-default btn-xs"
          onClick={() => {
            updateFilters({ from_date: null, to_date: null });
          }}
          active={all_periods}
        >
          All
        </Button>
        {[...periods].map((period) => {
          let current_period =
            period.from_date == filters.from_date &&
            period.to_date == filters.to_date;
          return (
            <Button
              className="btn btn-default btn-xs"
              key={"period-" + period.id + "-" + period.offset}
              onClick={() => {
                updateFilters({
                  from_date: period.from_date,
                  to_date: period.to_date,
                });
              }}
              active={current_period}
            >
              {period.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionFilterPeriods;
