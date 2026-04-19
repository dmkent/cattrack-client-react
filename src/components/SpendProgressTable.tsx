import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { ProgressBar, Table } from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import { ProgressRow, ProgressTotals, UpcomingBill } from "../data/Progress";

export interface SpendProgressTableProps {
  rows: ProgressRow[];
  totals: ProgressTotals;
}

function progressVariant(
  actualSpend: number,
  budget: number,
): "success" | "warning" | "danger" {
  const value = (actualSpend / budget) * 80.0;
  if (value >= 84) {
    return "danger";
  } else if (value > 76) {
    return "warning";
  }
  return "success";
}

const budgetMarker = (
  <div className="bar-step" style={{ left: "80%" }}>
    <div className="label-line"></div>
  </div>
);

function CurrencyValue({ value }: { value: number }): JSX.Element {
  return (
    <FormattedNumber
      value={value}
      style="currency"
      currency="AUD"
      maximumSignificantDigits={3}
    />
  );
}

function BillsDetail({ bills }: { bills: UpcomingBill[] }): JSX.Element {
  return (
    <tr>
      <td colSpan={6}>
        <Table size="sm" className="mb-0 ms-4">
          <thead>
            <tr>
              <th>Bill</th>
              <th>Expected Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, idx) => (
              <tr key={idx}>
                <td>{bill.name}</td>
                <td>{bill.expected_date}</td>
                <td>
                  <CurrencyValue value={parseFloat(bill.expected_amount)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </td>
    </tr>
  );
}

export function SpendProgressTable(
  props: SpendProgressTableProps,
): JSX.Element {
  const { rows, totals } = props;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: ProgressRow["id"]) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          <th>Category</th>
          <th>Spent</th>
          <th>Progress</th>
          <th>Budget</th>
          <th>Expected Remaining</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const actualSpend = Math.abs(parseFloat(row.actual_spend));
          const budget = row.budget ? Math.abs(parseFloat(row.budget)) : null;
          const hasBills = row.upcoming_bills.length > 0;
          const isExpanded = expanded[row.id] ?? false;

          return (
            <Fragment key={row.id}>
              <tr>
                <td>
                  {hasBills && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(row.id)}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${row.name}`}
                      aria-expanded={isExpanded}
                      className="btn btn-link p-0 border-0 text-decoration-none"
                    >
                      <FontAwesomeIcon
                        icon={isExpanded ? faChevronDown : faChevronRight}
                      />
                    </button>
                  )}
                </td>
                <td>{row.name}</td>
                <td>
                  <CurrencyValue value={actualSpend} />
                </td>
                <td>
                  {budget !== null && budget > 0 ? (
                    <ProgressBar
                      variant={progressVariant(actualSpend, budget)}
                      now={(actualSpend / budget) * 80.0}
                      label={budgetMarker}
                    />
                  ) : null}
                </td>
                <td>
                  {budget !== null ? (
                    <CurrencyValue value={budget} />
                  ) : (
                    <span className="text-muted">No budget</span>
                  )}
                </td>
                <td>
                  <CurrencyValue
                    value={Math.abs(parseFloat(row.expected_remaining))}
                  />
                </td>
              </tr>
              {isExpanded && <BillsDetail bills={row.upcoming_bills} />}
            </Fragment>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="fw-bold">
          <td></td>
          <td>Total</td>
          <td>
            <CurrencyValue value={Math.abs(parseFloat(totals.actual_spend))} />
          </td>
          <td></td>
          <td>
            {totals.budget !== null ? (
              <CurrencyValue value={Math.abs(parseFloat(totals.budget))} />
            ) : null}
          </td>
          <td>
            <CurrencyValue
              value={Math.abs(parseFloat(totals.expected_remaining))}
            />
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}
