import TrackActionTypes from '../data/TrackActionTypes';

import {fetch_from_api, checkStatus} from '../client/CatTrackAPI';

import Transaction from '../data/Transaction';
import Category from '../data/Category';

const CategorisorActions = {
  categorisorSetTransaction(transaction) {
    return (dispatch, getState) => {
      dispatch({
        type: TrackActionTypes.CATEGORISOR_SET_TRANSACTION,
        transaction: transaction,
      });

      return fetch_from_api(
        dispatch, getState, 
        '/api/transactions/' + transaction.id + '/suggest/')
        .then(checkStatus)
        .then(resp => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_RECEIVED,
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_SUGGESTIONS_ERROR,
            error,
          });
        });
    }
  },

  loadCategories() {
    return (dispatch, getState) => {
      return fetch_from_api(dispatch, getState, '/api/categories/')
        .then(checkStatus)
        .then(resp => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_CATEGORIES_RECEIVED,
            categories: resp.map(cat => {
                return new Category(cat);
            }),
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.CATEGORISOR_CATEGORIES_ERROR,
            error,
          });
        })
    };
  },

  categorisorAddSplit() {
    return {
      type: TrackActionTypes.CATEGORISOR_ADD_SPLIT,
    }
  },

  categorisorRemoveSplit(idx) {
    return {
      type: TrackActionTypes.CATEGORISOR_REMOVE_SPLIT,
      idx
    }
  },

  categorisorSetSplit(idx, name, value) {
    return {
      type: TrackActionTypes.CATEGORISOR_SET_SPLIT,
      idx,
      name,
      value,
    }
  },

  categorisorShow() {
    return {
      type: TrackActionTypes.CATEGORISOR_SHOW,
    };
  },

  categorisorHide() {
    return {
      type: TrackActionTypes.CATEGORISOR_HIDE,
    };
  },

  categorisorSave(transaction, splits, onDone) {
    return (dispatch, getState) => {
      let updated = transaction;
      if (splits !== null && splits.size === 1) {
          let new_category = splits.get(0).category;
          updated = updated.set("category", new_category);
      }
      return fetch_from_api(dispatch, getState, '/api/transactions/' + updated.id + '/', {
        method: 'PUT',
        body: JSON.stringify(updated),
        headers: {'Content-Type': 'application/json'}
      })
      .then(checkStatus)
      .then(resp => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_UPDATED,
            transaction: new Transaction(resp),
          });

          if (splits !== null && splits.size > 1) {
            return fetch_from_api(dispatch, getState, '/api/transactions/' + updated.id + '/split/', {
              method: 'POST',
              body: JSON.stringify(splits),
              headers: {'Content-Type': 'application/json'}
            })
            .then(checkStatus)
            .then(() => {
              dispatch({
                type: TrackActionTypes.TRANSACTION_SPLIT_SUCCESS,
              });
              onDone();
              dispatch(this.categorisorHide())
            })
            .catch(error => {
              dispatch({
                type: TrackActionTypes.TRANSACTION_SPLIT_ERROR,
                error,
              });
            });
          }
          dispatch(this.categorisorHide())
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.TRANSACTION_UPDATE_ERROR,
            error,
          });
        });
    };
  }
};

export default CategorisorActions;