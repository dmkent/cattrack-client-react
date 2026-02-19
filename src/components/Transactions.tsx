import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Tooltip,
  OverlayTrigger,
  Pagination,
  FormSelect,
  Accordion,
} from "react-bootstrap";
import { FormattedDate, FormattedNumber } from "react-intl";

import { Category } from "../data/Category";
import { Transaction } from "../data/Transaction";
import {
  TransactionFilters,
  createDefaultTransactionFilters,
} from "../data/TransactionFilters";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import { useUpdateTransactions } from "../hooks/useUpdateTransactions";
import {
  loadFiltersFromCookie,
  saveFiltersToCookie,
} from "../utils/filterCookies";
import { Categorisor } from "./Categorisor";
import { TransactionFilter } from "./TransactionFilter";

interface TransactionsProps {
  page_size: number;
}

export function Transactions(props: TransactionsProps): JSX.Element | null {
  const { page_size } = props;
  const { updateTransactionSplits } = useUpdateTransactions();
  const [active_page, setPage] = useState<number>(1);

  const [filters, setFilters] = useState<TransactionFilters>(() => {
    const savedFilters = loadFiltersFromCookie();
    return savedFilters ?? createDefaultTransactionFilters();
  });

  const [selected_transaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modal_shown, setModalShown] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const selectRef = useRef<HTMLSelectElement>(null);

  // Save filters to cookie whenever they change
  useEffect(() => {
    saveFiltersToCookie(filters);
  }, [filters]);

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  useEffect(() => {
    if (editingCategoryId && selectRef.current) {
      // Small delay to ensure the select is rendered and focused
      setTimeout(() => {
        selectRef.current?.showPicker?.();
      }, 0);
    }
  }, [editingCategoryId]);

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

  function handleCategoryClick(transactionId: string): void {
    setEditingCategoryId(transactionId);
  }

  function handleCategoryChange(
    trans: Transaction,
    newCategoryId: string,
  ): void {
    if (newCategoryId === trans.category) {
      setEditingCategoryId(null);
      return;
    }

    const updatedTransaction = { ...trans, category: newCategoryId };
    updateTransactionSplits(updatedTransaction, null, () => {
      reloadPage();
      setEditingCategoryId(null);
    });
  }

  function handleCategoryBlur(): void {
    setEditingCategoryId(null);
  }

  const { num_records, transactions } = data;
  const num_pages = Math.ceil(num_records / page_size);
  const paginationProps = (active: boolean) => ({
    linkClassName: active ? "link-muted" : "link-secondary",
  });

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
      {/* Mobile filter accordion */}
      <div className="d-md-none mb-3">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filter Transactions</Accordion.Header>
            <Accordion.Body>
              <TransactionFilter filters={filters} setFilters={setFilters} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="row">
        <div className="col-md-10">
          <div className="table-responsive-custom">
            <table className="table table-sm transactions-table">
              <thead className="d-none d-md-table-header-group">
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trans) => {
                  let description = trans.description;
                  if (description.length > 50) {
                    description = description.substring(0, 50) + "...";
                  }
                  return (
                    <tr key={trans.id}>
                      <td data-label="Date">
                        <FormattedDate value={trans.when} />
                      </td>
                      <td data-label="Description">
                        {tooltips && (
                          <OverlayTrigger
                            placement="bottom"
                            overlay={tooltips[trans.id]}
                          >
                            <span>{description}</span>
                          </OverlayTrigger>
                        )}
                      </td>
                      <td data-label="Amount" className="text-end">
                        <span
                          className={
                            trans.amount < 0 ? "text-danger" : undefined
                          }
                        >
                          <FormattedNumber
                            value={trans.amount || 0.0}
                            style="currency"
                            currency="AUD"
                          />
                        </span>
                      </td>
                      <td data-label="Category">
                        {editingCategoryId === trans.id ? (
                          <FormSelect
                            ref={selectRef}
                            size="sm"
                            value={trans.category}
                            onChange={(e) =>
                              handleCategoryChange(trans, e.target.value)
                            }
                            onBlur={handleCategoryBlur}
                            autoFocus
                          >
                            {categories.map((cat: Category) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </FormSelect>
                        ) : (
                          <button
                            className="badge text-bg-secondary"
                            onClick={() => handleCategoryClick(trans.id)}
                            role="button"
                            tabIndex={0}
                          >
                            {trans.category_name}
                          </button>
                        )}
                      </td>
                      <td data-label="Actions">
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
          </div>
          <Pagination className="justify-content-center">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              {...paginationProps(false)}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(Math.max(1, active_page - 1))}
              {...paginationProps(false)}
            />
            {Array.from({ length: Math.min(5, num_pages) }, (_, i) => {
              const first_page = Math.max(0, active_page - 2);
              const page = first_page + i + 1;
              return (
                <Pagination.Item
                  key={page}
                  active={page === active_page}
                  onClick={() => handlePageChange(page)}
                  {...paginationProps(page === active_page)}
                >
                  {page}
                </Pagination.Item>
              );
            })}
            <Pagination.Next
              onClick={() =>
                handlePageChange(Math.min(num_pages, active_page + 1))
              }
              {...paginationProps(false)}
            />
            <Pagination.Last
              onClick={() => handlePageChange(num_pages)}
              {...paginationProps(false)}
            />
          </Pagination>
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
        {/* Desktop filter in right rail */}
        <div className="d-none d-md-block col-md-2">
          <TransactionFilter filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}
