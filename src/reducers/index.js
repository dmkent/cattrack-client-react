import { combineReducers } from "redux";
import errors from "./errors";

const catTrackApp = combineReducers({
  errors,
});

export default catTrackApp;
