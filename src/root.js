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
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import AppContainer from './containers/AppContainer';
import catTrackApp from './reducers';
import rootSaga from './sagas'

import 'bootstrap/dist/css/bootstrap.css';
import './styles/local.css';
import 'react-dates/lib/css/_datepicker.css';
import {ProgressBar} from 'react-bootstrap';
import {bootstrapUtils} from 'react-bootstrap/lib/utils';
bootstrapUtils.addStyle(ProgressBar, 'grey');

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';

addLocaleData([...en]);

const router_middleware = routerMiddleware(browserHistory);

// Create the saga middleware
const saga_middleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(catTrackApp, composeEnhancers(
    applyMiddleware(thunk, router_middleware, saga_middleware)
));

// Then run the saga
saga_middleware.run(rootSaga)

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)