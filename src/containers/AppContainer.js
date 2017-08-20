import AppView from '../views/AppView';
import CatTrackStore from '../data/CatTrackStore';
import {Container} from 'flux/utils';

function getStores() {
  return [
    CatTrackStore
  ];
}

function getState() {
  return {
     version: "2.0",
     title: "CatTrack",
     transactions: CatTrackStore.getState(),
  };
}

export default Container.createFunctional(AppView,
                                          getStores, getState);