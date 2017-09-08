import TrackActions from '../TrackActions'
import TrackActionTypes from '../../data/TrackActionTypes'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  it('should create an action to clear error', () => {
    const idx = 2
    const expectedAction = {
      type: TrackActionTypes.CLEAR_ERROR,
      error_number: idx
    }
    expect(TrackActions.clearError(idx)).toEqual(expectedAction);
  });

  it('should create an add split action', () => {
    const expectedAction = {
      type: TrackActionTypes.CATEGORISOR_ADD_SPLIT,
    };
    expect(TrackActions.categorisorAddSplit()).toEqual(expectedAction);
  });
})