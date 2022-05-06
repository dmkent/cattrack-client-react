import React from "react";
import { Button } from "react-bootstrap";
import useAccounts from "../hooks/useAccounts";
import usePeriods from "../hooks/usePeriods";
import useCategories from "../hooks/useCategories";

import TransactionFilterPeriods from "./TransactionFilterPeriods";

function TransactionFilter(props) {
  const { filters, setFilters } = props;
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const { isLoading: isCategoriesLoading, data: categories } = useCategories();
  const updateFilters = (newValues) =>
    setFilters(Object.assign({}, filters, newValues));

  if (isAccountsLoading || isPeriodsLoading || isCategoriesLoading) {
    return null;
  }

  return (
    <div className="col-md-2">
      <TransactionFilterPeriods
        filters={filters}
        updateFilters={updateFilters}
        periods={periods}
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
        {[...categories].map((category) => {
          return (
            <Button
              className="btn btn-default btn-xs"
              key={"cat-" + category.id}
              onClick={() => {
                updateFilters({
                  category: category.id,
                  has_category: "True",
                });
              }}
              active={filters.category == category.id}
            >
              {category.name}
            </Button>
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
        {[...accounts.values()].map((account) => {
          return (
            <Button
              className="btn btn-default btn-xs"
              key={"acct-" + account.id}
              onClick={() => {
                updateFilters({ account: account.id });
              }}
              active={filters.account == account.id}
            >
              {account.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionFilter;
