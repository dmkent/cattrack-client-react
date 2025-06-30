import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext } from "../../hooks/AuthContext";
import NavComponent from "../NavComponent";

function setup(logged_in: boolean) {
  const mockAuth = {
    authData: logged_in
      ? {
          is_logged_in: true,
          username: "testuser",
          user_id: 1,
          email: "testuser@example.com",
          expires: new Date(Date.now() + 3600 * 1000),
          token: "testtoken",
        }
      : null,
    signin: vi.fn(),
    signout: vi.fn(),
    refresh: vi.fn(),
    loading: false,
  };

  render(
    <AuthContext.Provider value={mockAuth}>
      <Router basename="/">
        <NavComponent />
      </Router>
    </AuthContext.Provider>,
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
