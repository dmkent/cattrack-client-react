import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import Tracking from "./Tracking";
import PaymentSeries from "./PaymentSeries";
import CONFIG from "ctrack_config";
import NavComponent from "./NavComponent";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import Login from "./Login";
import { AuthProvider, useAuth } from "../hooks/AuthContext"
import { AxiosProvider } from "../hooks/AxiosContext";

function App() {
  return (
    <IntlProvider locale="en-AU">
      <AuthProvider>
        <AxiosProvider>
          <Router basename={CONFIG.BASENAME}>
            <div>
              <NavComponent />
              <div className="container-fluid">
                <h1>CatTrack</h1>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route
                    path="/"
                    element={
                      <RequireAuth redirectTo="/login">
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  <Route path="/accounts" element={
                    <RequireAuth redirectTo="/login">
                      <Accounts />
                    </RequireAuth>
                  }
                  />
                  <Route path="/tracking" element={
                    <RequireAuth redirectTo="/login">
                      <Tracking />
                    </RequireAuth>
                  }
                  />
                  <Route
                    path="/transactions" element={
                      <RequireAuth redirectTo="/login">
                        <Transactions page_size={50} />
                      </RequireAuth>
                    }
                  />
                  <Route path="/bills" element={
                    <RequireAuth redirectTo="/login">
                      <PaymentSeries />
                    </RequireAuth>
                  }
                  />
                </Routes>
              </div>
              <div>
                <p className="pull-right text-muted">
                  <small>Client version: {CONFIG.VERSION}</small>
                </p>
              </div>
            </div>
          </Router>
        </AxiosProvider>
      </AuthProvider>
    </IntlProvider>
  );
}

export function Logout(props) {
  const { signout } = useAuth();
  
  useEffect(() => signout(() => {}), []);
  return <Navigate to="/login" />;
}

export function RequireAuth({ children, redirectTo }) {
  let { user, loading } = useAuth();
  let isAuthenticated = user?.is_logged_in;
  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
