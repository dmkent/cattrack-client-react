import React from "react";
import { shallow } from "enzyme";
import NavComponent from "../NavComponent";
import AuthService from "../../services/auth.service";

function setup(logged_in) {
  if (logged_in) {
    AuthService.dummyLogin();
  } else {
    AuthService.logout();
  }

  const enzymeWrapper = shallow(<NavComponent />);

  return {
    props: {},
    enzymeWrapper,
  };
}

describe("components", () => {
  describe("NavComponent", () => {
    it("should render self and subcomponents when logged out", () => {
      const { enzymeWrapper, props } = setup(false);
      expect(enzymeWrapper.find("NavItem").children().length).toBe(6);
      expect(enzymeWrapper.find("NavItem").at(0).html()).toContain("Dashboard");
      expect(enzymeWrapper.find("NavItem").at(1).html()).toContain("Accounts");
      expect(enzymeWrapper.find("NavItem").at(5).html()).toContain("Login");
    });

    it("should render self and subcomponents when logged in", () => {
      const { enzymeWrapper, props } = setup(true);
      expect(enzymeWrapper.find("NavItem").children().length).toBe(6);
      expect(enzymeWrapper.find("NavItem").at(0).html()).toContain("Dashboard");
      expect(enzymeWrapper.find("NavItem").at(1).html()).toContain("Accounts");
      expect(enzymeWrapper.find("NavItem").at(5).html()).toContain("Logout");
    });
  });
});
