/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<AppContainer/>, document.getElementById('root'));

import TrackActions from './data/TrackActions';
TrackActions.addTransaction(Date(2017, 1, 1), "got money", -30.0);
TrackActions.selectTransactionPage(1);