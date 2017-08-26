import { combineReducers } from 'redux';
import auth from './auth';
import transactions from './transactions';
import accounts from './accounts';


const app = (state, action) => {
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
});

export default catTrackApp;