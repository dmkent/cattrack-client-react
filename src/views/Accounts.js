import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, FormGroup, FormControl, Table, Popover, OverlayTrigger} from 'react-bootstrap';

import AccountDetailContainer from '../containers/AccountDetailContainer';

class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selected_account: null,
          newname: ""
        };
        this.createAccount = this.createAccount.bind(this);
        this.selectAccount = this.selectAccount.bind(this);
        this.overlayRef = null;
    }
    
    componentDidMount() {
        this.props.loadAccounts();
    }

    createAccount() {
      this.props.createAccount(this.state.newname);
      this.setState({newname: ""})
      if (this.overlayRef !== null) {
        this.overlayRef.hide();
      }
    }

    selectAccount(event) {
      let target = event.target;
      if (target.tagName === "TD") {
        target = target.parentNode;
      }
      this.setState({selected_account: target.getAttribute('data-item')});
    }

    render() {
      const popoverCreate = (
        <Popover id="popover-create" title="Add account">
          <FormGroup controlId="name">
            <ControlLabel>Name: </ControlLabel>
            <FormControl type="text" onChange={(event) => {this.setState({newname: event.target.value})}} value={this.state.newname}/>
          </FormGroup>
          <Button onClick={this.createAccount}>Add</Button>
        </Popover>
      );

        return (
          <div>
          <h3>Accounts 
            <OverlayTrigger trigger="click" rootClose placement="right" overlay={popoverCreate} ref={(elem) => {this.overlayRef = elem}}>
              <Button bsSize="small">
                      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
              </Button>
            </OverlayTrigger>
          </h3>
          <Table>
          <tbody>
            {
              [...this.props.accounts.accounts.values()].map((account) => {
                return (<tr key={account.id} data-item={account.id} onClick={this.selectAccount}>
                  <td>{account.name}</td>
                  <td>...</td>
                </tr>);
              })
            }
          </tbody>
          </Table>
          <div>
          {this.state.selected_account !== null &&
            <AccountDetailContainer account={this.state.selected_account}/>
          }
          </div>
          </div>
        );
    }
}
Accounts.propTypes = {
  accounts: PropTypes.object.isRequired,
  createAccount: PropTypes.func.isRequired,
  loadAccounts: PropTypes.func.isRequired,
}

export default Accounts;