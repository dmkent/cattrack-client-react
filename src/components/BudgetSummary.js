import React from "react";
import { Row, Col, ProgressBar } from "react-bootstrap";
import { FormattedNumber } from "react-intl";
import PropTypes from "prop-types";
import useBudgetSummaries from "../hooks/useBudgetSummaries";

function BudgetLine(props) {
  let style = null;
  // 80% should be budget 100% spent.
  const value = (props.actual / props.budget) * 80.0;
  if (value >= 84) {
    style = "danger";
  } else if (value > 76) {
    style = "warning";
  } else {
    style = "success";
  }

  const marker = (
    <div className="bar-step" style={{ left: "80%" }}>
      <div className="label-line"></div>
    </div>
  );

  return (
    <Row>
      <Col md={4}>
        <span className="text pull-right budget-label">{props.name}</span>
      </Col>
      <Col md={5}>
        <ProgressBar bsStyle={style} now={value} label={marker} />
      </Col>
      <Col md={3}>
        <span className={"text pull-left text-" + style}>
          <FormattedNumber
            value={props.actual}
            style="currency"
            currency="AUD"
            maximumSignificantDigits={3}
          />
        </span>
        <span className="text pull-right">
          <FormattedNumber value={props.budget} maximumSignificantDigits={3} />
        </span>
        <span className="text text-center center-block"> / </span>
      </Col>
    </Row>
  );
}

BudgetLine.propTypes = {
  name: PropTypes.string.isRequired,
  actual: PropTypes.number.isRequired,
  budget: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
};

function BudgetSummary(props) {
  const { isLoading, data: summaries } = useBudgetSummaries(
    props.from_date,
    props.to_date
  );

  if (isLoading || summaries === null) {
    return null;
  }

  const max_amount = summaries.reduce(
    (prev, next) => Math.max(prev, next.budget, -1 * next.value),
    0
  );
  const scale = 100.0 / max_amount;
  return (
    <div>
      {summaries.map((summary, idx) => {
        return (
          <BudgetLine
            key={idx}
            name={summary.name}
            budget={summary.budget}
            actual={-1 * summary.value}
            scale={scale}
          />
        );
      })}
    </div>
  );
}

BudgetSummary.propTypes = {
  from_date: PropTypes.string.isRequired,
  to_date: PropTypes.string.isRequired,
};

export default BudgetSummary;
