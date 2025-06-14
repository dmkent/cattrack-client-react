import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import Tracking from "./Tracking";
import PaymentSeries from "./PaymentSeries";
import CONFIG from "ctrack_config";
import NavComponent from "./NavComponent";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Login from "./Login";
import { useAuthToken } from "../hooks/useAuthToken";
import AuthService from "../services/auth.service";

function App() {
  const auth = useAuthToken();

  return (
    <IntlProvider locale="en-AU">
      <Router basename={CONFIG.BASENAME}>
        <div>
          <NavComponent />
          <div className="container-fluid">
            <h1>CatTrack</h1>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>
              <Route
                exact
                path="/"
                render={() => (
                  <RequireAuth auth={auth} redirectTo="/login">
                    <Dashboard />
                  </RequireAuth>
                )}
              />
              <Route path="/accounts" render={() => (
                <RequireAuth auth={auth} redirectTo="/login">
                  <Accounts />
                </RequireAuth>
              )}
              />
              <Route path="/tracking" render={() => (
                <RequireAuth auth={auth} redirectTo="/login">
                  <Tracking />
                </RequireAuth>
              )}
              />
              <Route
                path="/transactions" render={() => (
                  <RequireAuth auth={auth} redirectTo="/login">
                    <Transactions page_size={50} />
                  </RequireAuth>
                )}
              />
              <Route path="/bills" render={() => (
                <RequireAuth auth={auth} redirectTo="/login">
                  <PaymentSeries />
                </RequireAuth>
              )}
              />
            </Switch>
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

function RequireAuth({ children, redirectTo, auth }) {
  let isAuthenticated = auth.is_logged_in
  return isAuthenticated ? children : <Redirect to={redirectTo}/>;
}

export default App;
