import Immutable from "immutable";
import reducer from "../category";
import TrackActionTypes from "../../data/TrackActionTypes";

describe("category reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({ series: Immutable.List() });
  });

  it("should handle CATEGORY_SERIES_LOADED", () => {
    const initState = { series: Immutable.List() };

    const expectedState = {
      series: Immutable.List([
        Immutable.Map({ value: -32, label: "2013-02-01" }),
        Immutable.Map({ value: -45, label: "2002-01-01" }),
      ]),
    };

    expect(
      reducer(initState, {
        type: TrackActionTypes.CATEGORY_SERIES_LOADED,
        series: [
          { value: -32, label: "2013-02-01" },
          { value: -45, label: "2002-01-01" },
        ],
      })
    ).toEqual(expectedState);
  });

  it("should handle CATEGEGORY_SERIES_LOAD_ERROR", () => {
    expect(
      reducer(
        {},
        {
          type: TrackActionTypes.CATEGORY_SERIES_LOAD_ERROR,
        }
      )
    ).toEqual({});
  });
});
