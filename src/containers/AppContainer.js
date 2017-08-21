import AppView from '../views/AppView';
import CatTrackStore from '../data/CatTrackStore';
import AuthStore from '../data/AuthStore';
import {Container} from 'flux/utils';

function getStores() {
  return [
    CatTrackStore,
    AuthStore,
  ];
}

function getState() {
  return {
     version: "2.0",
     title: "CatTrack",
     transactions: CatTrackStore.getState(),
     auth: AuthStore.getState(),
  };
}

export default Container.createFunctional(AppView,
                                          getStores, getState);