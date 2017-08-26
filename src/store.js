import catTrackApp from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

const router_middleware = routerMiddleware(browserHistory);

let store = createStore(
    catTrackApp,
    applyMiddleware(thunk, router_middleware)
);

export default store;