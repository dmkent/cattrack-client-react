import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, ProgressBar} from 'react-bootstrap';
import {FormattedNumber} from 'react-intl';
import PropTypes from 'prop-types';

class BudgetLine extends React.Component {
  render() {
    let style = "success";
    const actualPerc = this.props.actual * this.props.scale;
    const budgetPerc = this.props.budget * this.props.scale;
    if (this.props.actual > this.props.budget) {
      style = "danger";
    }
    return (
      <Row>
        <Col md={3}>
          <p>{this.props.name}</p>
        </Col>
        <Col md={5}>
          <ProgressBar bsStyle={style} now={actualPerc} />
          <ProgressBar bsStyle="grey" now={budgetPerc} />
        </Col>
        <Col md={2}>
        <FormattedNumber value={this.props.actual} style="currency" currency="AUD" maximumSignificantDigits={3}/>
        /
        <FormattedNumber value={this.props.budget} style="currency" currency="AUD" maximumSignificantDigits={3}/>
        </Col>
      </Row>
    );
  }
}

BudgetLine.propTypes = {
  name: PropTypes.string.isRequired,
  actual: PropTypes.number.isRequired,
  budget: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
}

class BudgetSummary extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: "BUDGET_SUMMARY_FETCH",
    })
  }

  render() {
    if (this.props.summaries === null) {
      return null;
    }

    const max_amount = this.props.summaries.reduce((prev, next) => Math.max(prev, next.budget, -1 * next.value), 0);
    const scale = 100.0 / max_amount;
    return (
      <div>
        {this.props.summaries.map((summary, idx) => {
          return <BudgetLine key={idx} name={summary.name} budget={summary.budget} actual={-1 * summary.value} scale={scale}/>
        })}
      </div>
    );
  }
}

BudgetSummary.propTypes = {
  summaries: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export function mapStateToProps(state) {
  return {
    token: state.auth.token,
    summaries: state.budget.summaries,
    from_date: state.transactions.filters.from_date,
    to_date: state.transactions.filters.to_date,
  };
}

const BudgetSummaryContainer = connect(
  mapStateToProps
)(BudgetSummary)

export default BudgetSummaryContainer;