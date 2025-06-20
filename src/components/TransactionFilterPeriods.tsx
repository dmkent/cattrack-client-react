import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import ParseDate from "date-fns/parse";
import { format } from "date-fns";

const fmtStr = "yyyy-MM-dd";

interface Period {
  id: string | number;
  label: string;
  from_date: string;
  to_date: string;
  offset: string;
}

interface Filters {
  from_date: string | null;
  to_date: string | null;
}

interface TransactionFilterPeriodsProps {
  filters: Filters;
  updateFilters: (filters: Partial<Filters>) => void;
  periods: Period[];
}

function TransactionFilterPeriods(props: TransactionFilterPeriodsProps) {
  const { filters, updateFilters, periods } = props;

  let all_periods = filters.from_date === null && filters.to_date === null;
  const fromDateVal = filters.from_date
    ? ParseDate(filters.from_date, fmtStr, new Date(2022, 1, 1))
    : null;
  const toDateVal = filters.to_date
    ? ParseDate(filters.to_date, fmtStr, new Date(2022, 1, 1))
    : null;
  return (
    <div>
      <h3 data-testid="dateRangePicker">Time</h3>
      <DateRangePicker
        value={[fromDateVal, toDateVal]}
        onChange={(data: [Date | null, Date | null] | null) => {
          if (!data) return;

          const [startDate, endDate] = data;
          updateFilters({
            from_date: startDate === null ? null : format(startDate, fmtStr),
            to_date: endDate === null ? null : format(endDate, fmtStr),
          });
        }}
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