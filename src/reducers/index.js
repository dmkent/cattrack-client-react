import { combineReducers } from 'redux';
import auth from './auth';
import transactions from './transactions';
import accounts from './accounts';
import categories from './categories';
import periods from './periods';
import errors from './errors';

function app(state, action) {
  console.log(action);
  return {
    version: "2.0",
    title: "CatTrack",
  };
}


const catTrackApp = combineReducers({
  app,
  auth,
  transactions,
  accounts,
  categories,
  periods,
  errors,
});

export default catTrackApp;