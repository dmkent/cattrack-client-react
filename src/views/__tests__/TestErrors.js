import React from "react";
import { mount } from "enzyme";
import Immutable from "immutable";
import Errors from "../Errors";

function setup(messages) {
  const props = {
    errors: {
      errors: Immutable.OrderedMap(messages),
    },
    handleAlertDismiss: jest.fn(),
  };

  const enzymeWrapper = mount(<Errors {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

describe("components", () => {
  describe("Errors", () => {
    it("should render self and subcomponents", () => {
      const { enzymeWrapper } = setup([]);

      expect(enzymeWrapper.find("div").children().exists()).toBe(false);
    });

    it("should call handleAlertDismiss when removing error", () => {
      const { enzymeWrapper, props } = setup([
        [0, { title: "Error title: ", messages: ["an error"] }],
      ]);
      const alert = enzymeWrapper.find("Alert");
      expect(alert.find("p").text()).toBe("Error title: ");
      alert.props().onDismiss();
      expect(props.handleAlertDismiss.mock.calls.length).toBe(1);
    });
  });
});
