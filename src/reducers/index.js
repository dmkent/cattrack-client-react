import { combineReducers } from "redux";
import transactions from "./transactions";
import accounts from "./accounts";
import categories from "./categories";
import periods from "./periods";
import errors from "./errors";
import category from "./category";
import bills from "./bills";
import budget from "./budget";
import CONFIG from "config";

function app(state, action) {
  console.log(action);
  return {
    version: CONFIG.VERSION,
    title: "CatTrack",
  };
}

const catTrackApp = combineReducers({
  app,
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
