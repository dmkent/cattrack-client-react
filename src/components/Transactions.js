import React, { useState } from "react";
import { useQueryClient } from "react-query";
import PropTypes from "prop-types";
import { FormattedDate, FormattedNumber } from "react-intl";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Pagination } from "@react-bootstrap/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import updateTransactionSplits from "../client/transactions";

import Categorisor from "./Categorisor";
import TransactionFilter from "./TransactionFilter";
import useTransactions from "../hooks/useTransactions";

function Transactions(props) {
  const { page_size } = props;
  const [active_page, setPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [selected_transaction, setSelectedTransaction] = useState(null);
  const [modal_shown, setModalShown] = useState(false);

  const { isLoading, isError, data } = useTransactions(
    active_page,
    page_size,
    filters
  );
  const queryClient = useQueryClient();

  if (isLoading || isError || !data.transactions) {
    return null;
  }

  function reloadPage() {
    queryClient.invalidateQueries("transactions");
  }

  const { num_records, transactions } = data;
  const num_pages = num_records / page_size;

  const tooltips = {};
  transactions.forEach((trans) => {
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
          <table className="table table-condensed">
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
                      <span className="label label-default">
                        {trans.category_name}
                      </span>
                    </td>
                    <td>
                      <Button
                        bsSize="small"
                        onClick={(e) => {
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
      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        items={num_pages}
        maxButtons={5}
        bsSize="medium"
        activePage={active_page}
        onSelect={setPage}
      />
    </div>
  );
}

Transactions.propTypes = {
  page_size: PropTypes.number.isRequired,
};
export default Transactions;
