import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { DateRangePicker, toMomentObject } from "react-dates";

function TransactionFilterPeriods(props) {
  const { filters, updateFilters, periods } = props;
  const [focusedInput, setFocusedInput] = useState(null);

  let all_periods = filters.from_date === null && filters.to_date === null;
  return (
    <div>
      <h3>Time</h3>
      <DateRangePicker
        startDate={toMomentObject(filters.from_date)}
        startDateId="drp_start_transaction_filter_periods"
        endDate={toMomentObject(filters.to_date)}
        endDateId="drp_end_transaction_filter_periods"
        onDatesChange={({ startDate, endDate }) =>
          updateFilters({
            from_date:
              startDate === null ? null : startDate.format("YYYY-MM-DD"),
            to_date: endDate === null ? null : endDate.format("YYYY-MM-DD"),
          })
        }
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        isOutsideRange={() => {
          return false;
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
