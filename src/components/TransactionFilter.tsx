import { Button } from "react-bootstrap";

import { TransactionFilters } from "../data/TransactionFilters";
import { useAccounts } from "../hooks/useAccounts";
import { useCategories } from "../hooks/useCategories";
import { usePeriods } from "../hooks/usePeriods";
import { TransactionFilterPeriods } from "./TransactionFilterPeriods";

export interface TransactionFilterProps {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
}

interface TransactionFilterButtonProps {
  name: string;
  isActive: boolean;
  onClick: (name: string) => void;
}

export function TransactionFilter(
  props: TransactionFilterProps,
): JSX.Element | null {
  const { filters, setFilters } = props;
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();
  const { isLoading: isPeriodsLoading, data: periods } = usePeriods();
  const { isLoading: isCategoriesLoading, data: categories } = useCategories();
  const updateFilters = (newValues: Partial<TransactionFilters>): void =>
    setFilters(Object.assign({}, filters, newValues));

  if (
    isAccountsLoading ||
    isPeriodsLoading ||
    isCategoriesLoading ||
    periods === undefined ||
    categories === undefined
  ) {
    return null;
  }

  const TransactionFilterButton = ({
    name,
    isActive,
    onClick,
  }: TransactionFilterButtonProps): JSX.Element => (
    <Button
      variant="outline-secondary"
      size="sm"
      active={isActive}
      onClick={() => onClick(name)}
      key={name}
    >
      {name}
    </Button>
  );

  return (
    <div className="col-md-2">
      <TransactionFilterPeriods
        filters={filters}
        updateFilters={updateFilters}
        periods={periods}
      />
      <h3>Category</h3>
      <div className="btn-group-vertical btn-group-sm" role="group">
        <Button
          variant="outline-secondary"
          onClick={() => {
            updateFilters({ category: null, has_category: null });
          }}
          active={filters.category === null && filters.has_category !== "False"}
          data-testid="cat-all"
        >
          All
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => {
            updateFilters({ has_category: "False", category: null });
          }}
          active={filters.has_category === "False"}
        >
          None
        </Button>
        {categories &&
          [...categories].map((category) => {
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
          variant="outline-secondary"
          onClick={() => {
            updateFilters({ account: null });
          }}
          active={filters.account === null}
          data-testid="acct-all"
        >
          All
        </Button>
        {accounts &&
          [...accounts.values()].map((account) => {
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
