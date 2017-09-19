import { combineReducers } from 'redux';
import auth from './auth';
import transactions from './transactions';
import accounts from './accounts';
import categories from './categories';
import periods from './periods';
import errors from './errors';
import CONFIG from 'config';

function app(state, action) {
  console.log(action);
  return {
    version: CONFIG.VERSION,
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