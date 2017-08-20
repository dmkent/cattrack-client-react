/**
 * Copyright (c) 2017-present, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import Transaction from '../data/Transaction';
import CatTrackAPI from './CatTrackAPI';
import TrackDispatcher from '../data/TrackDispatcher';

const CatTrackDataManager = {
  loadTransactions(page_num: number) {
    CatTrackAPI
      .get('/api/transactions', {page_num})
      .then(rawTransactions => {
        TrackDispatcher.dispatch({
          type: 'transactions/loaded',
          page_num: page_num,
          transactions: rawTransactions.results.map(rawTransaction => {
              return new Transaction(rawTransaction);
          }),
        });
      })
      .catch(error => {
        TrackDispatcher.dispatch({
          type: 'transactions/load-error',
          page_num,
          error,
        });
      });
  },
};


export default CatTrackDataManager;
