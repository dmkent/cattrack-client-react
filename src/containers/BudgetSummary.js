import React from 'react';
import {connect} from 'react-redux';
import {Row, Col, ProgressBar} from 'react-bootstrap';
import {FormattedNumber} from 'react-intl';
import PropTypes from 'prop-types';

class BudgetLine extends React.Component {
  render() {
    let style = null;
    // 80% should be budget 100% spent.
    const value = this.props.actual / this.props.budget * 80.0;
    if (value >= 84) {
      style = "danger";
    } else if (value > 76) {
      style = "warning";
    } else {
      style = "success";
    }

    const marker = (
      <div className="bar-step" style={{left: "80%"}}>
        <div className="label-line"></div>
      </div>
    );

    return (
      <Row>
        <Col md={4}>
          <span className="text pull-right budget-label">{this.props.name}</span>
        </Col>
        <Col md={5}>
          <ProgressBar bsStyle={style} now={value} label={marker}/>
        </Col>
        <Col md={3}>
        <span className={"text pull-left text-" + style}><FormattedNumber value={this.props.actual} style="currency" currency="AUD" maximumSignificantDigits={3}/></span>
        <span className="text pull-right"><FormattedNumber value={this.props.budget} maximumSignificantDigits={3}/></span>
        <span className="text text-center center-block"> / </span>
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