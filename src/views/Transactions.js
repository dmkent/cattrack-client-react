import React from 'react';
import {FormattedDate} from 'react-intl';

class Transactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_filtered: false,
        };
    }
    render() {
        if (this.props.transactions === undefined) {
            return null;
        }
        
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
                      <td>{trans.description}</td>
                      <td className="text-right">{trans.amount}</td>
                      <td><span className="label label-default">{trans.category_name}</span></td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-default btn-sm">
                              <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                          </button>
                          <button className="btn btn-default btn-sm">
                              <span className="glyphicon glyphicon-tags" aria-hidden="true"></span>
                          </button>
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
            </div>
            <div className="col-md-2">
                <h3>Time</h3>
                <p>-- OR --</p>
                <div className="btn-group-vertical" role="group">
                    <button className="btn btn-default btn-xs">All</button>
                </div>
                <h3>Category</h3>
                <div className="btn-group-vertical" role="group">
                    <button className="btn btn-default btn-xs">All</button>
                </div>
                <h3>Account</h3>
                <div className="btn-group-vertical" role="group">
                    <button className="btn btn-default btn-xs">All</button>
                </div>
            </div>
          </div>
          </div>
        );
    }
}

export default Transactions;