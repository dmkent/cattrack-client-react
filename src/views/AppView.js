import React from 'react';
import { Button, Modal, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Login from './Login';
import TrackActions from '../data/TrackActions'
import {IntlProvider} from 'react-intl';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect,
} from 'react-router-dom';
 
class AppView extends React.Component {
  componentWillMount() {
    TrackActions.restoreLogin();
  }

  render() {
    return (
      <IntlProvider locale="en">
        <Router>
          <div>
            <NavComponent auth={this.props.auth}/>
            <div className="container-fluid">
              <h1>{this.props.title}</h1>
              <ContentView transactions={this.props.transactions} auth={this.props.auth}/>
            </div>
            <div>
              <p className="pull-right text-muted"><small>Client version: { this.props.version }</small></p>
            </div>
          </div>
        </Router>
      </IntlProvider>
    );
  }
}

class NavComponent extends React.Component {
  render() {
    let auth_link = null;
    if (this.props.auth.is_logged_in) {
      auth_link = (
        <Nav pullRight>
          <LinkContainer to="/logout"><NavItem>Logout</NavItem></LinkContainer>
        </Nav>
      );
    } else {
      auth_link = (
        <Nav pullRight>
          <LinkContainer to="/login"><NavItem>Login</NavItem></LinkContainer>
        </Nav>
      );
    }

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
          {this.props.auth.is_logged_in ? 
           <Navbar.Text pullRight>{this.props.auth.username}</Navbar.Text> :
           null}
          {auth_link}
        </Navbar.Collapse>
      </Navbar>                  
    )
  }
}

class Logout extends React.Component {
  componentWillMount() {
    TrackActions.logout();
  }

  render() {
    return <Redirect to="/login"/>;
  }
}

const PrivateRoute = ({ component: Component, auth, render, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (auth.is_logged_in) {
        if (render !== undefined) {
          return render(props);
        } else {
          return <Component {...props}/>;
        }
      } else {
        return (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
        );
      }
    }}/>
  )
};

class ContentView extends React.Component {
  render() {
    return (
      <div>
      <Route path="/login" render={(props) => { return <Login {...props} {...this.props}/>}}/>
      <Route path="/logout" component={Logout}/>
      <Route exact path="/" auth={this.props.auth} component={Dashboard}/>
      <PrivateRoute path="/accounts" auth={this.props.auth} component={Dashboard}/>
      <PrivateRoute path="/transactions" auth={this.props.auth} render={() => { return <Transactions transactions={this.props.transactions}/>}}/>
      </div>
    );
  }
}

export default AppView;