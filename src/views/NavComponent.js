import React from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useAuthToken } from "../hooks/useAuthToken";

function NavComponent() {
  const auth = useAuthToken();

  let auth_link = null;
  if (auth.is_logged_in) {
    auth_link = (
      <Nav pullRight>
        <LinkContainer to="/logout">
          <NavItem>Logout</NavItem>
        </LinkContainer>
      </Nav>
    );
  } else {
    auth_link = (
      <Nav pullRight>
        <LinkContainer to="/login">
          <NavItem>Login</NavItem>
        </LinkContainer>
      </Nav>
    );
  }

  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">CatTrack</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer exact to="/">
            <NavItem>Dashboard</NavItem>
          </LinkContainer>
          <LinkContainer to="/accounts">
            <NavItem>Accounts</NavItem>
          </LinkContainer>
          <LinkContainer to="/tracking">
            <NavItem>Tracking</NavItem>
          </LinkContainer>
          <LinkContainer to="/transactions">
            <NavItem>Transactions</NavItem>
          </LinkContainer>
          <LinkContainer to="/bills">
            <NavItem>Bills</NavItem>
          </LinkContainer>
        </Nav>
        {auth.is_logged_in ? (
          <Navbar.Text pullRight>{auth.username}</Navbar.Text>
        ) : null}
        {auth_link}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavComponent;
