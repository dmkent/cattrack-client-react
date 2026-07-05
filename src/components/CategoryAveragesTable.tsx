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
  // Multiplier applied to the mean daily amount to extrapolate the period rate.
  perDayMultiplier: number;
}

const DAYS_PER_YEAR = 365.25;

const TIME_PERIODS: TimePeriod[] = [
  { label: "Annual", perDayMultiplier: DAYS_PER_YEAR },
  { label: "Monthly", perDayMultiplier: DAYS_PER_YEAR / 12 },
  { label: "Fortnightly", perDayMultiplier: 14 },
  { label: "Weekly", perDayMultiplier: 7 },
];

interface SubcategoryGroup {
  name: string;
  entries: CategorySummary[];
  total: number;
}

function calculateDaysBetween(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  // Don't count days in the future: cap the end of the period to today so
  // extrapolated rates aren't diluted by a period that hasn't elapsed yet.
  const today = new Date();
  const effectiveTo = to.getTime() > today.getTime() ? today : to;
  const diffTime = effectiveTo.getTime() - from.getTime();
  if (diffTime < 0) {
    return 1;
  }
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

function calculateAverage(
  total: number,
  periodDays: number,
  perDayMultiplier: number,
): number {
  if (periodDays === 0) {
    return 0;
  }
  const dailyRate = total / periodDays;
  return dailyRate * perDayMultiplier;
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
      if (key === "Transferring Money" || key === "Loan transaction") {
        return; // Skip these categories
      }

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

  const renderCurrencyCell = (value: number, key: string) => (
    <td key={key}>
      <FormattedNumber
        value={value}
        style="currency"
        currency="AUD"
        minimumFractionDigits={0}
        maximumFractionDigits={0}
      />
    </td>
  );

  const renderValueCells = (total: number, keyPrefix: string) => (
    <Fragment>
      {renderCurrencyCell(total, `${keyPrefix}-total`)}
      {TIME_PERIODS.map((period) => {
        const average = calculateAverage(
          total,
          periodDays,
          period.perDayMultiplier,
        );
        return renderCurrencyCell(average, `${keyPrefix}-${period.label}`);
      })}
    </Fragment>
  );

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
          <td colSpan={TIME_PERIODS.length + 2}>
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
            <th>Total</th>
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
