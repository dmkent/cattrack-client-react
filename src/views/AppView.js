import React from "react";
import { connect } from "react-redux";
import Dashboard from "../components/Dashboard";
import Accounts from "../components/Accounts";
import Transactions from "../components/Transactions";
import Tracking from "../components/Tracking";
import PaymentSeries from "../components/PaymentSeries";
import CONFIG from "config";
import NavComponent from "../components/NavComponent";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "../components/Login";
import { useAuthToken } from "../hooks/useAuthToken";
import AuthService from "../services/auth.service";

function AppView() {
  return (
    <IntlProvider locale="en-AU">
      <Router basename={CONFIG.BASENAME}>
        <div>
          <NavComponent />
          <div className="container-fluid">
            <h1>CatTrack</h1>
            <ContentView />
          </div>
          <div>
            <p className="pull-right text-muted">
              <small>Client version: {CONFIG.VERSION}</small>
            </p>
          </div>
        </div>
      </Router>
    </IntlProvider>
  );
}

export class Logout extends React.Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return <Redirect to="/login" />;
  }
}

const logoutMapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(AuthService.logout());
    },
  };
};

export const LogoutContainer = connect((state) => {
  return {};
}, logoutMapDispatchToProps)(Logout);

export const PrivateRoute = ({
  component: Component,
  auth,
  render,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.is_logged_in) {
          if (render !== undefined) {
            return render(props);
          } else {
            return <Component {...props} />;
          }
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location.pathname },
              }}
            />
          );
        }
      }}
    />
  );
};

export function ContentView() {
  const auth = useAuthToken();

  return (
    <div>
      <Route path="/login" component={Login} />
      <Route path="/logout" component={LogoutContainer} />
      <PrivateRoute exact path="/" auth={auth} component={Dashboard} />
      <PrivateRoute
        path="/accounts"
        auth={auth}
        component={Accounts}
      />
      <PrivateRoute
        path="/tracking"
        auth={auth}
        component={Tracking}
      />
      <PrivateRoute path="/transactions" auth={auth} render={() => <Transactions page_size={50}/>}/>
      <PrivateRoute
        path="/bills"
        auth={auth}
        component={PaymentSeries}
      />
    </div>
  );
}

export default AppView;
