import React from 'react';
import { Button, Table } from 'react-bootstrap';

import AccountDetailContainer from '../containers/AccountDetailContainer';

class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selected_account: null
        };
        this.createAccount = this.createAccount.bind(this);
        this.selectAccount = this.selectAccount.bind(this);
    }
    
    createAccount(event) {
      console.log("create: " + event);
    }

    selectAccount(event) {
      const target = event.target;
      this.setState({selected_account: target.getAttribute('data-item')});
    }

    render() {
        return (
          <div>
          <h3>Accounts
            <Button bsSize="small" onClick={this.createAccount}>
                    <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </Button>
          </h3>
          <Table>
          <tbody>
            {
              [...this.props.accounts.accounts.values()].map((account) => {
                return (<tr key={account.id} data-item={account.id} onClick={this.selectAccount}>
                  <td data-item={account.id}>{account.name}</td>
                  <td>...</td>
                </tr>);
              })
            }
          </tbody>
          </Table>
          <div>
          {
            (this.state.selected_account !== null) ?
            <AccountDetailContainer account={this.state.selected_account}/> : null
          }
          </div>
          </div>
        );
    }
}

export default Accounts;