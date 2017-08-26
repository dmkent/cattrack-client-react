import { combineReducers } from 'redux';
import auth from './auth';
import transactions from './transactions';
import accounts from './accounts';

const catTrackApp = combineReducers({
  auth,
  transactions,
  accounts,
});

export default catTrackApp;