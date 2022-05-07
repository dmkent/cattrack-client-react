import { combineReducers } from "redux";
import accounts from "./accounts";
import errors from "./errors";
import budget from "./budget";

const catTrackApp = combineReducers({
  accounts,
  errors,
  budget,
});

export default catTrackApp;
