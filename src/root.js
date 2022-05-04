/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";
import createSagaMiddleware from "redux-saga";

import "react-dates/initialize";

import AppContainer from "./containers/AppContainer";
import catTrackApp from "./reducers";
import rootSaga from "./sagas";

import "bootstrap/dist/css/bootstrap.css";
import "./styles/local.css";
import "react-dates/lib/css/_datepicker.css";

// React query client
const queryClient = new QueryClient();

const browserHistory = createBrowserHistory();
const router_middleware = routerMiddleware(browserHistory);

// Create the saga middleware
const saga_middleware = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const store = createStore(
  catTrackApp,
  composeEnhancers(applyMiddleware(thunk, router_middleware, saga_middleware))
);

// Then run the saga
saga_middleware.run(rootSaga);

render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </QueryClientProvider>,
  document.getElementById("root")
);
