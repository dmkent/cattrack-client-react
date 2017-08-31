import React from 'react';
import {Button} from 'react-bootstrap';

class TransactionFilterPeriods extends React.Component {
  componentDidMount() {
    if (this.props.periods.size == 0) {
      this.props.loadPeriods();
    }
  }

  render() {
    let all_periods = ((this.props.filters.from_date === null) &&
                       (this.props.filters.to_date === null));
    return (
        <div>
            <h3>Time</h3>
            <p>-- OR --</p>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter({from_date: null, to_date: null})}}
                        active={all_periods}>All</Button>
                {[...this.props.periods].map((period) => {
                    let current_period = ((period.from_date == this.props.filters.from_date) &&
                                          (period.to_date == this.props.filters.to_date));
                    return <Button className="btn btn-default btn-xs" key={"period-" + period.id + "-" + period.offset}
                            onClick={() => {
                                this.props.onFilter({from_date: period.from_date, to_date: period.to_date})
                            }}
                            active={current_period}>{period.label}</Button>
                })}
            </div>
        </div>
    );
  }
}

export default TransactionFilterPeriods;