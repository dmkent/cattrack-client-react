import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import Tracking from "./Tracking";
import PaymentSeries from "./PaymentSeries";
import CONFIG from "config";
import NavComponent from "./NavComponent";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import { useAuthToken } from "../hooks/useAuthToken";
import AuthService from "../services/auth.service";

function App() {
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

export function Logout(props) {
  useEffect(() => {
    AuthService.logout();
  }, []);

  return <Redirect to="/login" />;
}

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
      <Route path="/logout" component={Logout} />
      <PrivateRoute exact path="/" auth={auth} component={Dashboard} />
      <PrivateRoute path="/accounts" auth={auth} component={Accounts} />
      <PrivateRoute path="/tracking" auth={auth} component={Tracking} />
      <PrivateRoute
        path="/transactions"
        auth={auth}
        render={() => <Transactions page_size={50} />}
      />
      <PrivateRoute path="/bills" auth={auth} component={PaymentSeries} />
    </div>
  );
}

export default App;
