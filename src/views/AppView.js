import React from 'react';
import { Button, Modal, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import {IntlProvider} from 'react-intl';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
 
function AppView(props) {
  return (
    <IntlProvider locale="en">
      <Router>
        <div>
          <NavComponent/>
          <div className="container-fluid">
            <h1>{props.title}</h1>
            <ContentView transactions={props.transactions}/>
          </div>
          <div>
            <p className="pull-right text-muted"><small>Client version: { props.version }</small></p>
          </div>
        </div>
      </Router>
    </IntlProvider>
  );
}

class NavComponent extends React.Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">CatTrack</Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/"><NavItem>Dashboard</NavItem></LinkContainer>
            <LinkContainer to="/accounts"><NavItem>Accounts</NavItem></LinkContainer>
            <LinkContainer to="/transactions"><NavItem>Transactions</NavItem></LinkContainer>
          </Nav>
          <Nav pullRight>
            <LinkContainer to="/logout"><NavItem>Logout</NavItem></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>                  
    )
  }
}

class ContentView extends React.Component {
  render() {
    return (
      <div>
      <Route exact path="/" component={Dashboard}/>
      <Route path="/accounts" component={Dashboard}/>
      <Route path="/transactions" render={() => { return <Transactions transactions={this.props.transactions}/>}}/>
      </div>
    );
  }
}

export default AppView;