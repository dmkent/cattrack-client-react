import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Tooltip, OverlayTrigger, Pagination } from "react-bootstrap";
import { FormattedDate, FormattedNumber } from "react-intl";

import { Transaction } from "../data/Transaction";
import { TransactionFilters } from "../data/TransactionFilters";
import useTransactions from "../hooks/useTransactions";
import { useUpdateTransactions } from "../hooks/useUpdateTransactions";
import Categorisor from "./Categorisor";
import TransactionFilter from "./TransactionFilter";

interface TransactionsProps {
  page_size: number;
}

function Transactions(props: TransactionsProps): JSX.Element | null {
  const { page_size } = props;
  const { updateTransactionSplits } = useUpdateTransactions();
  const [active_page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<TransactionFilters>({
    category: null,
    has_category: null,
    account: null,
    to_date: null,
    from_date: null,
  });
  const [selected_transaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modal_shown, setModalShown] = useState<boolean>(false);

  const { isLoading, isError, data } = useTransactions(
    active_page,
    page_size,
    filters,
  );
  const queryClient = useQueryClient();

  if (isLoading || isError || !data || !data.transactions) {
    return null;
  }

  function reloadPage(): void {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }

  const { num_records, transactions } = data;
  const num_pages = Math.ceil(num_records / page_size);

  const tooltips: { [key: string]: JSX.Element } = {};
  transactions.forEach((trans: Transaction) => {
    tooltips[trans.id] = (
      <Tooltip key={"tooltip-" + trans.id} id={"tooltip-" + trans.id}>
        {trans.description}
      </Tooltip>
    );
  });

  return (
    <div>
      <h3>Transactions</h3>
      <div className="row">
        <div className="col-md-10">
          <table className="table table-sm">
            <tbody>
              {[...transactions.values()].map((trans) => {
                let description = trans.description;
                if (description.length > 50) {
                  description = description.substr(0, 50) + "...";
                }
                return (
                  <tr key={trans.id}>
                    <td>
                      <FormattedDate value={trans.when} />
                    </td>
                    <td>
                      {tooltips && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={tooltips[trans.id]}
                        >
                          <span>{description}</span>
                        </OverlayTrigger>
                      )}
                    </td>
                    <td className="text-right">
                      <span
                        className={trans.amount < 0 ? "text-danger" : undefined}
                      >
                        <FormattedNumber
                          value={trans.amount || 0.0}
                          style="currency"
                          currency="AUD"
                        />
                      </span>
                    </td>
                    <td>
                      <span className="badge text-bg-secondary">
                        {trans.category_name}
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => {
                          setSelectedTransaction(trans);
                          setModalShown(true);
                        }}
                        data-testid={"catbutton-" + trans.id}
                      >
                        <FontAwesomeIcon icon={faTags} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selected_transaction && (
            <Categorisor
              transaction={selected_transaction}
              showModal={modal_shown}
              setModalShown={setModalShown}
              save={(transaction, splits) =>
                updateTransactionSplits(transaction, splits, reloadPage)
              }
            />
          )}
        </div>
        <TransactionFilter filters={filters} setFilters={setFilters} />
      </div>
      <Pagination>
        <Pagination.First onClick={() => setPage(1)} />
        <Pagination.Prev
          onClick={() => setPage(Math.max(1, active_page - 1))}
        />
        {Array.from({ length: Math.min(5, num_pages) }, (_, i) => {
          const first_page = Math.max(0, active_page - 2);
          const page = first_page + i + 1;
          return (
            <Pagination.Item
              key={page}
              active={page === active_page}
              onClick={() => setPage(page)}
            >
              {page}
            </Pagination.Item>
          );
        })}
        <Pagination.Next
          onClick={() => setPage(Math.min(num_pages, active_page + 1))}
        />
        <Pagination.Last onClick={() => setPage(num_pages)} />
      </Pagination>
    </div>
  );
}

export default Transactions;
