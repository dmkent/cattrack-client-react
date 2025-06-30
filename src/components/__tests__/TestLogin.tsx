import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { expect, test } from "vitest";

import Login from "../Login";

test("should render self and subcomponents", () => {
  render(
    <Router>
      <Login />
    </Router>,
  );

  expect(screen.findByLabelText("Username")).toBeTruthy();
  expect(screen.findByLabelText("Password")).toBeTruthy();
});
