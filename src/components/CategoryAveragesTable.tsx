import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useMemo, useState } from "react";
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

interface SubcategoryGroup {
  name: string;
  entries: CategorySummary[];
  total: number;
}

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // Calculate the number of days in the selected period
  let periodDays = 1;
  if (filters.from_date && filters.to_date) {
    periodDays = calculateDaysBetween(filters.from_date, filters.to_date);
  }

  const groupedSubcategories = useMemo<SubcategoryGroup[]>(() => {
    const groupMap = new Map<string, CategorySummary[]>();
    summary.forEach((item) => {
      const key = item.subcategory ?? "None";
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)?.push(item);
    });

    return Array.from(groupMap.entries()).map(([name, entries]) => ({
      name,
      entries,
      total: entries.reduce((acc, entry) => acc + entry.total, 0),
    }));
  }, [summary]);

  const incomeGroups = useMemo(() => {
    return groupedSubcategories
      .filter((group) => group.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [groupedSubcategories]);

  const expenseGroups = useMemo(() => {
    return groupedSubcategories
      .filter((group) => group.total <= 0)
      .sort((a, b) => a.total - b.total);
  }, [groupedSubcategories]);

  const incomeSubtotal = useMemo(() => {
    return incomeGroups.reduce((acc, group) => acc + group.total, 0);
  }, [incomeGroups]);

  const expenseSubtotal = useMemo(() => {
    return expenseGroups.reduce((acc, group) => acc + group.total, 0);
  }, [expenseGroups]);

  const grandTotal = incomeSubtotal + expenseSubtotal;

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const renderValueCells = (total: number, keyPrefix: string) =>
    TIME_PERIODS.map((period) => {
      const average = calculateAverage(total, periodDays, period.days);
      return (
        <td key={`${keyPrefix}-${period.label}`}>
          <FormattedNumber
            value={average}
            style="currency"
            currency="AUD"
            minimumFractionDigits={0}
            maximumFractionDigits={0}
          />
        </td>
      );
    });

  const renderGroupRows = (
    label: string,
    groups: SubcategoryGroup[],
    subtotal: number,
    subtotalLabel: string,
  ) => {
    if (groups.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <tr>
          <td colSpan={TIME_PERIODS.length + 1}>
            <strong>{label}</strong>
          </td>
        </tr>
        {groups.map((group) => {
          const isExpanded = expandedGroups[group.name] ?? false;
          return (
            <Fragment key={group.name}>
              <tr>
                <td>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 me-2"
                    aria-label={`Toggle ${group.name}`}
                    aria-expanded={isExpanded}
                    onClick={() => toggleGroup(group.name)}
                  >
                    <FontAwesomeIcon
                      icon={isExpanded ? faChevronDown : faChevronRight}
                    />
                  </button>
                  <strong>{group.name}</strong>
                </td>
                {renderValueCells(group.total, `${group.name}-group`)}
              </tr>
              {isExpanded &&
                group.entries.map((entry) => (
                  <tr key={entry.category_id}>
                    <td className="ps-4">{entry.category_name}</td>
                    {renderValueCells(entry.total, entry.category_id)}
                  </tr>
                ))}
            </Fragment>
          );
        })}
        <tr>
          <td>
            <strong>{subtotalLabel}</strong>
          </td>
          {renderValueCells(subtotal, `${subtotalLabel}-subtotal`)}
        </tr>
      </Fragment>
    );
  };

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
          {renderGroupRows(
            "Income",
            incomeGroups,
            incomeSubtotal,
            "Income subtotal",
          )}
          {renderGroupRows(
            "Expenses",
            expenseGroups,
            expenseSubtotal,
            "Expenses subtotal",
          )}
          {groupedSubcategories.length > 0 && (
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              {renderValueCells(grandTotal, "grand-total")}
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
