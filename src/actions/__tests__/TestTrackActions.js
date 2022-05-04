import TrackActions from "../TrackActions";
import TrackActionTypes from "../../data/TrackActionTypes";

describe("Top level actions", () => {
  it("should create an action to clear error", () => {
    const idx = 2;
    const expectedAction = {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx,
    };
    expect(TrackActions.clearError(idx)).toEqual(expectedAction);
  });
});
