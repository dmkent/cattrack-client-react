import { Row, Col, ProgressBar } from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import useBudgetSummaries from "../hooks/useBudgetSummaries";

interface BudgetLineProps {
  name: string;
  actual: number;
  budget: number;
  scale: number;
}

function BudgetLine(props: BudgetLineProps): JSX.Element {
  let style: "danger" | "warning" | "success" = "success";
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
        <ProgressBar variant={style} now={value} label={marker} />
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

interface BudgetSummaryProps {
  from_date: string;
  to_date: string;
}

interface Summary {
  name: string;
  budget: number;
  value: number;
}

function BudgetSummary(props: BudgetSummaryProps): JSX.Element | null {
  const { isLoading, data: summaries } = useBudgetSummaries(
    props.from_date,
    props.to_date,
  );

  if (isLoading || summaries === null || summaries === undefined) {
    return null;
  }

  const max_amount = summaries.reduce(
    (prev: number, next: Summary) =>
      Math.max(prev, next.budget, -1 * next.value),
    0,
  );
  const scale = 100.0 / max_amount;
  return (
    <div>
      {summaries.map((summary: Summary, idx: number) => {
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

export default BudgetSummary;
