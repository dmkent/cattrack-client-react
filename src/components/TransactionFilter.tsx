import React from "react";
import { Button } from "react-bootstrap";
import useAccounts from "../hooks/useAccounts";
import usePeriods from "../hooks/usePeriods";
import useCategories from "../hooks/useCategories";

import TransactionFilterPeriods from "./TransactionFilterPeriods";

interface TransactionFilters {
  category: string | null;
  has_category: string | null;
  account: string | null;
  to_date: string | null;
  from_date: string | null;
}

interface TransactionFilterProps {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
}

interface TransactionFilterButtonProps {
  name: string;
  isActive: boolean;
  onClick: (name: string) => void;
}

function TransactionFilter(props: TransactionFilterProps): JSX.Element | null {
  const { filters, setFilters } = props;
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const { isLoading: isCategoriesLoading, data: categories } = useCategories();
  const updateFilters = (newValues: Partial<TransactionFilters>): void =>
    setFilters(Object.assign({}, filters, newValues));

  if (isAccountsLoading || isPeriodsLoading || isCategoriesLoading) {
    return null;
  }

  const TransactionFilterButton = ({ name, isActive, onClick }: TransactionFilterButtonProps): JSX.Element => (
    <button
      className={`btn btn-default btn-xs ${isActive ? "active" : ""}`}
      onClick={() => onClick(name)}
      key={name}
    >
      {name}
    </button>
  );

  return (
    <div className="col-md-2">
      <TransactionFilterPeriods
        filters={filters}
        updateFilters={updateFilters}
        periods={periods || []}
      />
      <h3>Category</h3>
      <div className="btn-group-vertical" role="group">
        <Button
          className="btn btn-default btn-xs"
          onClick={() => {
            updateFilters({ category: null, has_category: null });
          }}
          active={filters.category === null && filters.has_category !== "False"}
          data-testid="cat-all"
        >
          All
        </Button>
        <Button
          className="btn btn-default btn-xs"
          onClick={() => {
            updateFilters({ has_category: "False", category: null });
          }}
          active={filters.has_category === "False"}
        >
          None
        </Button>
        {categories && [...categories].map((category) => {
          return (
            <TransactionFilterButton
              key={"cat-" + category.id}
              name={category.name}
              onClick={() => {
                updateFilters({
                  category: category.id,
                  has_category: "True",
                });
              }}
              isActive={filters.category == category.id}
            />
          );
        })}
      </div>
      <h3>Account</h3>
      <div className="btn-group-vertical" role="group">
        <Button
          className="btn btn-default btn-xs"
          onClick={() => {
            updateFilters({ account: null });
          }}
          active={filters.account === null}
          data-testid="acct-all"
        >
          All
        </Button>
        {accounts && [...accounts.values()].map((account) => {
          return (
            <TransactionFilterButton
              key={"acct-" + account.id}
              name={account.name}
              onClick={() => {
                updateFilters({ account: account.id });
              }}
              isActive={filters.account == account.id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TransactionFilter;