import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import DashboardContainer from '../containers/DashboardContainer';
import AccountsContainer from '../containers/AccountsContainer';
import TransactionList from '../containers/TransactionList';
import LoginContainer from '../containers/LoginContainer';
import ErrorsContainer from '../containers/ErrorsContainer';
import TrackingContainer from '../containers/TrackingContainer';
import CONFIG from 'config';
import NavComponent from './NavComponent';
import TrackActions from '../actions/TrackActions'
import {IntlProvider} from 'react-intl';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect,
} from 'react-router-dom';

class AppView extends React.Component {
  componentDidMount() {
    this.props.restoreLogin();
  }

  render() {
    return (
      <IntlProvider locale="en-AU">
        <Router basename={CONFIG.BASENAME}>
          <div>
            <NavComponent auth={this.props.auth}/>
            <div className="container-fluid">
              <ErrorsContainer/>
              <h1>{this.props.title}</h1>
              <ContentView {...this.props}/>
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

export class Logout extends React.Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return <Redirect to="/login"/>;
  }
}
const logoutMapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(TrackActions.logout())
    }
  }
}
export const LogoutContainer = connect(
  (state) => {return {}},
  logoutMapDispatchToProps
)(Logout)

export const PrivateRoute = ({ component: Component, auth, render, ...rest }) => {
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
            state: { from: props.location.pathname }
          }}/>
        );
      }
    }}/>
  )
};

export class ContentView extends React.Component {
  render() {
    return (
      <div>
      <Route path="/login" component={LoginContainer}/>
      <Route path="/logout" component={LogoutContainer}/>
      <PrivateRoute exact path="/" auth={this.props.auth} component={DashboardContainer}/>
      <PrivateRoute path="/accounts" auth={this.props.auth} component={AccountsContainer}/>
      <PrivateRoute path="/tracking" auth={this.props.auth} component={TrackingContainer}/>
      <PrivateRoute path="/transactions" auth={this.props.auth} component={TransactionList}/>
      </div>
    );
  }
}

export default AppView;