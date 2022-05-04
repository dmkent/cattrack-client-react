import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import { FormattedDate, FormattedNumber } from "react-intl";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Pagination } from "@react-bootstrap/pagination";

import CategorisorContainer from "../containers/CategorisorContainer";
import TransactionFilterContainer from "../containers/TransactionFilterContainer";

class Transactions extends React.Component {
  constructor(props) {
    super(props);

    props.onSelectTransactions(1, this.props.page_size, this.props.filters);
    this.showCategorisor = this.showCategorisor.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }

  showCategorisor(trans) {
    this.props.setCategorisorTransaction(trans);
    this.props.showCategorisor();
  }

  reloadPage() {
    this.props.onSelectTransactions(
      this.props.active_page,
      this.props.page_size,
      this.props.filters
    );
  }

  render() {
    if (this.props.transactions === undefined) {
      return null;
    }

    const tooltips = this.props.transactions.map((trans) => {
      return (
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
                {[...this.props.transactions.values()].map((trans) => {
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
                        <OverlayTrigger
                          placement="bottom"
                          overlay={tooltips.get(trans.id)}
                        >
                          <span>{description}</span>
                        </OverlayTrigger>
                      </td>
                      <td className="text-right">
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
                      <td>
                        <span className="label label-default">
                          {trans.category_name}
                        </span>
                      </td>
                      <td>
                        <Button
                          bsSize="small"
                          onClick={() => this.showCategorisor(trans)}
                        >
                          <span
                            className="glyphicon glyphicon-tags"
                            aria-hidden="true"
                          ></span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <CategorisorContainer reloadPage={this.reloadPage} />
          </div>
          <TransactionFilterContainer />
        </div>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={this.props.num_pages}
          maxButtons={5}
          bsSize="medium"
          activePage={this.props.active_page}
          onSelect={(page_num) => {
            this.props.onSelectTransactions(
              page_num,
              this.props.page_size,
              this.props.filters
            );
          }}
        />
      </div>
    );
  }
}

Transactions.propTypes = {
  active_page: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  num_pages: PropTypes.number.isRequired,
  page_size: PropTypes.number.isRequired,
  transactions: PropTypes.instanceOf(Immutable.OrderedMap),
  onSelectTransactions: PropTypes.func.isRequired,
  setCategorisorTransaction: PropTypes.func.isRequired,
  showCategorisor: PropTypes.func.isRequired,
};
export default Transactions;
