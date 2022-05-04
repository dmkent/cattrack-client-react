import React from "react";
import {
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from "react-bootstrap";
import { DateRangePicker, toMomentObject } from "react-dates";

class TransactionFilterPeriods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
  }

  componentDidMount() {
    if (this.props.periods.size == 0) {
      this.props.loadPeriods();
    }
  }

  render() {
    let all_periods =
      this.props.filters.from_date === null &&
      this.props.filters.to_date === null;
    return (
      <div>
        <h3>Time</h3>
        <DateRangePicker
          startDate={toMomentObject(this.props.filters.from_date)}
          startDateId="drp_start_transaction_filter_periods"
          endDate={toMomentObject(this.props.filters.to_date)}
          endDateId="drp_end_transaction_filter_periods"
          onDatesChange={({ startDate, endDate }) =>
            this.props.onFilter({
              from_date:
                startDate === null ? null : startDate.format("YYYY-MM-DD"),
              to_date: endDate === null ? null : endDate.format("YYYY-MM-DD"),
            })
          }
          focusedInput={this.state.focusedInput}
          onFocusChange={(focusedInput) => this.setState({ focusedInput })}
          isOutsideRange={() => {
            return false;
          }}
        />

        <p>-- OR --</p>
        <div className="btn-group-vertical" role="group">
          <Button
            className="btn btn-default btn-xs"
            onClick={() => {
              this.props.onFilter({ from_date: null, to_date: null });
            }}
            active={all_periods}
          >
            All
          </Button>
          {[...this.props.periods].map((period) => {
            let current_period =
              period.from_date == this.props.filters.from_date &&
              period.to_date == this.props.filters.to_date;
            return (
              <Button
                className="btn btn-default btn-xs"
                key={"period-" + period.id + "-" + period.offset}
                onClick={() => {
                  this.props.onFilter({
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
}

export default TransactionFilterPeriods;
