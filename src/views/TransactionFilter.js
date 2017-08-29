import React from 'react';
import {Button} from 'react-bootstrap';

class TransactionFilter extends React.Component {
  componentDidMount() {
    if (this.props.accounts.size == 0) {
      this.props.loadAccounts();
    }
    if (this.props.periods.size == 0) {
      this.props.loadPeriods();
    }
  }

  render() {
    let all_periods = ((this.props.filters.date_from === null) &&
                       (this.props.filters.date_to === null));
    return (
        <div className="col-md-2">
            <h3>Time</h3>
            <p>-- OR --</p>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter("date_from", null); this.props.onFilter("date_to", null)}}
                        active={all_periods}>All</Button>
                {[...this.props.periods].map((period) => {
                    let current_period = ((period.from_date == this.props.filters.date_from) &&
                                          (period.to_date == this.props.filters.date_to));
                    return <Button className="btn btn-default btn-xs" key={"period-" + period.id + "-" + period.offset}
                            onClick={() => {
                                this.props.onFilter("date_from", period.from_date);
                                this.props.onFilter("date_to", period.to_date)
                            }}
                            active={current_period}>{period.label}</Button>
                })}
            </div>
            <h3>Category</h3>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter("category", null)}}
                        active={this.props.filters.category === null}>All</Button>
                {[...this.props.categories].map((category) => {
                    return <Button className="btn btn-default btn-xs" key={"cat-" + category.id}
                            onClick={() => {this.props.onFilter("category", category.id)}}
                            active={this.props.filters.category == category.id}>{category.name}</Button>
                })}
            </div>
            <h3>Account</h3>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter("account", null)}}
                        active={this.props.filters.account === null}>All</Button>
                {[...this.props.accounts.values()].map((account) => {
                    return <Button className="btn btn-default btn-xs" key={"acct-" + account.id}
                            onClick={() => {this.props.onFilter("account", account.id)}}
                            active={this.props.filters.account == account.id}>{account.name}</Button>
                })}
            </div>
        </div>
    );
  }
}

export default TransactionFilter;