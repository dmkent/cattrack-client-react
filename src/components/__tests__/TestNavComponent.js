import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavComponent from "../NavComponent";
import { AuthContext } from "../../hooks/AuthContext";

function setup(logged_in) {
  const mockAuth = {
    user: logged_in ? { is_logged_in: true } : null,
    signin: jest.fn(),
    signout: jest.fn(),
    loading: false,
  };

  render(
    <AuthContext.Provider value={mockAuth}>
      <Router basename="/">
        <NavComponent />
      </Router>
    </AuthContext.Provider>
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
