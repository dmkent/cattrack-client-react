import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/AuthContext";

function NavComponent(): JSX.Element {
  const auth = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Navbar.Brand as={Link} to="/">
        CatTrack
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/accounts">
            Accounts
          </Nav.Link>
          <Nav.Link as={Link} to="/tracking">
            Tracking
          </Nav.Link>
          <Nav.Link as={Link} to="/transactions">
            Transactions
          </Nav.Link>
          <Nav.Link as={Link} to="/bills">
            Bills
          </Nav.Link>
        </Nav>
        <Nav>
          {auth.authData?.is_logged_in && (
            <Navbar.Text className="me-3">{auth.authData.username}</Navbar.Text>
          )}
          {auth.authData?.is_logged_in ? (
            <Nav.Link as={Link} to="/logout">
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavComponent;
