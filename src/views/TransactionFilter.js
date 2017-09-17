import React from 'react';
import {Button} from 'react-bootstrap';

import TransactionFilterPeriodsContainer from '../containers/TransactionFilterPeriodsContainer';

class TransactionFilter extends React.Component {
  componentDidMount() {
    if (this.props.accounts.size == 0) {
      this.props.loadAccounts();
    }
  }

  render() {
    return (
        <div className="col-md-2">
            <TransactionFilterPeriodsContainer/>
            <h3>Category</h3>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter({category: null})}}
                        active={this.props.filters.category === null}>All</Button>
                {[...this.props.categories].map((category) => {
                    return <Button className="btn btn-default btn-xs" key={"cat-" + category.id}
                            onClick={() => {this.props.onFilter({category: category.id})}}
                            active={this.props.filters.category == category.id}>{category.name}</Button>
                })}
            </div>
            <h3>Account</h3>
            <div className="btn-group-vertical" role="group">
                <Button className="btn btn-default btn-xs"
                        onClick={() => {this.props.onFilter({account: null})}}
                        active={this.props.filters.account === null}>All</Button>
                {[...this.props.accounts.values()].map((account) => {
                    return <Button className="btn btn-default btn-xs" key={"acct-" + account.id}
                            onClick={() => {this.props.onFilter({account: account.id})}}
                            active={this.props.filters.account == account.id}>{account.name}</Button>
                })}
            </div>
        </div>
    );
  }
}

export default TransactionFilter;