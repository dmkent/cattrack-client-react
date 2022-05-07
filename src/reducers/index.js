import { combineReducers } from "redux";
import accounts from "./accounts";
import categories from "./categories";
import errors from "./errors";
import category from "./category";
import bills from "./bills";
import budget from "./budget";

const catTrackApp = combineReducers({
  accounts,
  categories,
  errors,
  category,
  bills,
  budget,
});

export default catTrackApp;
