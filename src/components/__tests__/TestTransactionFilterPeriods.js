import React from "react";
import { mount } from "enzyme";
import Immutable from "immutable";
import { toMomentObject } from "react-dates";
import TransactionFilterPeriods from "../TransactionFilterPeriods";

function setup(periods, filters) {
  const props = {
    updateFilters: jest.fn(),
    filters: filters,
    periods: Immutable.List(periods),
  };

  const enzymeWrapper = mount(<TransactionFilterPeriods {...props} />);

  return {
    props,
    enzymeWrapper,
  };
}

describe("components", () => {
  describe("TransactionFilterPeriods", () => {
    it("should render self and subcomponents", () => {
      const { enzymeWrapper, props } = setup([], {});
      expect(enzymeWrapper.find("DateRangePicker").exists()).toBe(true);
    });

    it("changing dates should change filter", () => {
      const { enzymeWrapper, props } = setup([], {});

      enzymeWrapper
        .find("DateRangePicker")
        .props()
        .onDatesChange({
          startDate: toMomentObject(new Date("2017-01-01")),
          endDate: toMomentObject(new Date("2017-02-01")),
        });
      expect(props.updateFilters.mock.calls[0][0]).toEqual({
        from_date: "2017-01-01",
        to_date: "2017-02-01",
      });
      expect(props.updateFilters.mock.calls.length).toBe(1);
    });

    it("should display some periods", () => {
      const { enzymeWrapper, props } = setup(
        [
          {
            id: 0,
            offset: 0,
            from_date: "2017-01-01",
            to_date: "2017-02-01",
            label: "Month",
          },
        ],
        { to_date: null, from_date: null }
      );
      expect(enzymeWrapper.find("Button").at(1).text()).toBe("Month");
      expect(enzymeWrapper.find("Button").at(1).props().active).toBe(false);
      enzymeWrapper.find("Button").at(1).props().onClick();
      expect(props.updateFilters.mock.calls.length).toBe(1);
    });

    it("should display some periods and set active", () => {
      const { enzymeWrapper, props } = setup(
        [
          {
            id: 0,
            offset: 0,
            from_date: "2017-01-01",
            to_date: "2017-02-01",
            label: "Month",
          },
        ],
        { to_date: "2017-02-01", from_date: "2017-01-01" }
      );
      expect(enzymeWrapper.find("Button").at(1).text()).toBe("Month");
      expect(enzymeWrapper.find("Button").at(1).props().active).toBe(true);
      enzymeWrapper.find("Button").at(1).props().onClick();
      expect(props.updateFilters.mock.calls.length).toBe(1);
    });

    it("should detect null current filter", () => {
      const { enzymeWrapper, props } = setup(
        [
          {
            id: 0,
            offset: 0,
            from_date: "2017-01-01",
            to_date: "2017-02-01",
            label: "Month",
          },
        ],
        { from_date: null, to_date: null }
      );
      expect(enzymeWrapper.find("Button").at(0).props().active).toBe(true);
      enzymeWrapper.find("Button").at(1).props().onClick();
      expect(props.updateFilters.mock.calls.length).toBe(1);

      // reset to "All"
      enzymeWrapper.find("Button").at(0).props().onClick();
      expect(props.updateFilters.mock.calls.length).toBe(2);
      expect(props.updateFilters.mock.calls[1][0]).toEqual({
        from_date: null,
        to_date: null,
      });
    });
  });
});
