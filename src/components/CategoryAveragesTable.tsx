import { Table } from "react-bootstrap";
import { FormattedNumber } from "react-intl";

import { CategorySummary } from "../data/Transaction";
import { PeriodFilters } from "../data/TransactionFilters";

interface CategoryAveragesTableProps {
  summary: CategorySummary[];
  filters: PeriodFilters;
}

interface TimePeriod {
  label: string;
  days: number;
}

const TIME_PERIODS: TimePeriod[] = [
  { label: "Annual", days: 365 },
  { label: "Monthly", days: 30 },
  { label: "Fortnightly", days: 14 },
  { label: "Weekly", days: 7 },
];

function calculateDaysBetween(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

function calculateAverage(
  total: number,
  periodDays: number,
  targetDays: number,
): number {
  if (periodDays === 0) {
    return 0;
  }
  return (total / periodDays) * targetDays;
}

export function CategoryAveragesTable(
  props: CategoryAveragesTableProps,
): JSX.Element {
  const { summary, filters } = props;

  // Calculate the number of days in the selected period
  let periodDays = 1;
  if (filters.from_date && filters.to_date) {
    periodDays = calculateDaysBetween(filters.from_date, filters.to_date);
  }

  // Filter out income (positive values) and sort by total
  const expenseCategories = summary
    .filter((item) => item.total < 0)
    .sort((a, b) => a.total - b.total);

  return (
    <div data-testid="category-averages-table">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            {TIME_PERIODS.map((period) => (
              <th key={period.label}>{period.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenseCategories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_name}</td>
              {TIME_PERIODS.map((period) => {
                const average = calculateAverage(
                  category.total,
                  periodDays,
                  period.days,
                );
                return (
                  <td key={period.label}>
                    <FormattedNumber
                      value={Math.abs(average)}
                      style="currency"
                      currency="AUD"
                      minimumFractionDigits={0}
                      maximumFractionDigits={0}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
