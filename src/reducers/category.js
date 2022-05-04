import Immutable from "immutable";
import TrackActionTypes from "../data/TrackActionTypes";

/** Reducer to manage the category object state.
 *
 * The category state is comprised of the category transaction series.
 *
 * @param {Object} state - Input state to be reduced
 * @param {Object} action - Action to apply
 * @return {Object} - The updated state.
 */
function category(state = null, action) {
  if (state === null) {
    state = {
      series: Immutable.List(),
    };
  }
  switch (action.type) {
    case TrackActionTypes.CATEGORY_SERIES_LOADED:
      return Object.assign({}, state, {
        series: Immutable.List(
          action.series.map((raw) => {
            return Immutable.Map(raw);
          })
        ),
      });
    default:
      return state;
  }
}

export default category;
