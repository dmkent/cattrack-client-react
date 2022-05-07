import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../Login";

test("should render self and subcomponents", () => {
  render(<Login />)

  expect(screen.findByLabelText("Username")).toBeTruthy();

  expect(screen.findByLabelText("Password")).toBeTruthy();
});
