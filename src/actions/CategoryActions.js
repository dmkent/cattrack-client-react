import TrackActionTypes from '../data/TrackActionTypes';

import {fetch_from_api, checkStatus} from '../client/CatTrackAPI';

const CategoryActions = {
  loadCategorySeries(category_id, filters) {
    return (dispatch) => {
      return fetch_from_api(dispatch, '/api/categories/' + category_id + '/series/')
        .then(checkStatus)
        .then(series => {
          dispatch({
            type: TrackActionTypes.CATEGORY_SERIES_LOADED,
            series,
          });
        })
        .catch(error => {
          dispatch({
            type: TrackActionTypes.CATEGORY_SERIES_LOAD_ERROR,
            error,
          });
        });
    };
  },
};

export default CategoryActions;