import React from "react";
import { render, screen } from "@testing-library/react";
import App, { PrivateRoute } from "../App";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

function setup() {
  const props = {
    version: "test",
    title: "testtitle",
  };

  render(<App {...props} />);

  return {
    props,
  };
}

test("App should render self and subcomponents", () => {
  setup();

  expect(screen.getByRole("heading")).toBeTruthy();
  expect(screen.getAllByRole("button").length).toBe(1);
});

test("PrivateRoute should render redirect if logged out", () => {
  const res = PrivateRoute({
    component: () => {},
    auth: { is_logged_in: false },
  });
  expect(res.type).toBe(Route);
  expect(res.props.render({ location: "/" }).type).toBe(Redirect);
});

test("PrivateRoute should render component if logged in", () => {
  const res = PrivateRoute({
    component: "div",
    auth: { is_logged_in: true },
  });
  expect(res.type).toBe(Route);
  expect(res.props.render({ location: "/" })).toEqual(<div location={"/"} />);
});

test("PrivateRoute should render with render func if logged in", () => {
  const res = PrivateRoute({
    render: (props) => {
      return <div />;
    },
    auth: { is_logged_in: true },
  });
  expect(res.type).toBe(Route);
  expect(res.props.render({ location: "/" })).toEqual(<div />);
});
