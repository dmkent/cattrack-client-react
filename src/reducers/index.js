import { combineReducers } from "redux";
import transactions from "./transactions";
import accounts from "./accounts";
import categories from "./categories";
import periods from "./periods";
import errors from "./errors";
import category from "./category";
import bills from "./bills";
import budget from "./budget";

const catTrackApp = combineReducers({
  transactions,
  accounts,
  categories,
  periods,
  errors,
  category,
  bills,
  budget,
});

export default catTrackApp;
