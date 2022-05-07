import { combineReducers } from "redux";
import accounts from "./accounts";
import errors from "./errors";
import bills from "./bills";
import budget from "./budget";

const catTrackApp = combineReducers({
  accounts,
  errors,
  bills,
  budget,
});

export default catTrackApp;
