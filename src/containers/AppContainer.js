import AppView from '../views/AppView';
import CatTrackStore from '../data/CatTrackStore';
import AccountsStore from '../data/AccountsStore';
import AuthStore from '../data/AuthStore';
import {Container} from 'flux/utils';
import React from 'react';

class AppContainer extends React.Component {
  static getStores() {
    return [
     CatTrackStore,
     AccountsStore,
     AuthStore,
    ];
  }

  static calculateState(prevState) {
    return {
      version: "2.0",
      title: "CatTrack",
      transactions: CatTrackStore.getState(),
      auth: AuthStore.getState(),
      accounts: AccountsStore.getState(),
    };
  }

  render() {
    return <AppView {...this.state}/>;
  }
}

const container = Container.create(AppContainer, {pure: false});

export default container;