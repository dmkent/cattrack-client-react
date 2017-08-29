import React from 'react';
import {FormattedDate} from 'react-intl';
import {Button, Pagination, Tooltip, OverlayTrigger} from 'react-bootstrap';

import CategorisorContainer from '../containers/CategorisorContainer';
import TransactionFilterContainer from '../containers/TransactionFilterContainer';

class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_filtered: false,
        };

        props.onSelectTransactions(1, this.props.page_size, this.props.filters);
        this.showCategorisor = this.showCategorisor.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.filterTransactions = this.filterTransactions.bind(this);
      }

    showCategorisor(trans) {
      this.props.setCategorisorTransaction(trans);
      this.props.showCategorisor();
    }

    reloadPage() {
      this.props.onSelectTransactions(this.props.active_page, 
                                      this.props.page_size,
                                      this.props.filters);
    }

    filterTransactions(name, value) {
        const new_filter = Object.assign({}, this.props.filters, {
            [name]: value
        });
        this.props.onSelectTransactions(1, 
                                        this.props.page_size,
                                        new_filter)
    }

    render() {
        if (this.props.transactions === undefined) {
            return null;
        }

        const tooltips = this.props.transactions.map((trans) => {
            return <Tooltip id={"tooltip-" + trans.id}>{trans.description}</Tooltip>;
        });
        return (
          <div>
          <h3>Transactions</h3>
          <div className="row">
            <div className="col-md-10">
              <table className="table table-condensed">
                <tbody>
                {[...this.props.transactions.values()].map(trans => {
                  return (
                    <tr key={trans.id}>
                      <td><FormattedDate value={trans.when}/></td>
                      <td>
                        <OverlayTrigger placement="bottom" overlay={tooltips.get(trans.id)}>
                            <span>{(trans.description.length > 50) ? trans.description.substr(0, 50) + '...' : trans.description}</span>
                        </OverlayTrigger>
                      </td>
                      <td className="text-right">{trans.amount}</td>
                      <td><span className="label label-default">{trans.category_name}</span></td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-default btn-sm">
                              <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                          </button>
                          <Button bsSize="small" onClick={() => this.showCategorisor(trans)}>
                              <span className="glyphicon glyphicon-tags" aria-hidden="true"></span>
                          </Button>
                          <button className="btn btn-default btn-sm">
                              <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
                </table>
                <CategorisorContainer reloadPage={this.reloadPage}/>
            </div>
            <TransactionFilterContainer onFilter={this.filterTransactions}/>
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
            activePage={ this.props.active_page}
            onSelect={(page_num) => {
                this.props.onSelectTransactions(page_num, this.props.page_size, this.props.filters)
            }}
          />
          </div>
        );
    }
}

export default Transactions;