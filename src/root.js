/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import AppContainer from './containers/AppContainer';
import catTrackApp from './reducers';

import 'bootstrap/dist/css/bootstrap.css';

const router_middleware = routerMiddleware(browserHistory);

let store = createStore(
    catTrackApp,
    applyMiddleware(thunk, router_middleware)
);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)