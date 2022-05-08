import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavComponent from "../NavComponent";
import AuthService from "../../services/auth.service";

function setup(logged_in) {
  if (logged_in) {
    AuthService.dummyLogin();
  } else {
    AuthService.logout();
  }

  render(
    <Router basename="/">
      <NavComponent />
    </Router>
  );
}

describe("components", () => {
  describe("NavComponent", () => {
    it("should render self and subcomponents when logged out", () => {
      setup(false);
      expect(screen.getAllByRole("link").length).toBe(7);
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Accounts" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Login" })).toBeTruthy();
    });

    it("should render self and subcomponents when logged in", () => {
      setup(true);
      expect(screen.getAllByRole("link").length).toBe(7);
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Accounts" })).toBeTruthy();
      expect(screen.getByRole("link", { name: "Logout" })).toBeTruthy();
    });
  });
});
