/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppContainer from './containers/AppContainer';
//import catTrackApp from './reducers';
import store from './store';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
//import { createStore } from 'redux';


//let store = createStore(catTrackApp);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)