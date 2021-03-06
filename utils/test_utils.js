import Immutable from 'immutable'
import diff from 'jest-diff'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'react-dates/initialize';

configure({ adapter: new Adapter() });

expect.extend({
  toEqualImmutable(received, argument) {
    const recvImmut = Immutable.fromJS((Immutable.Map.isMap(received)) ? received.toJS(): received);
    const argImmut = Immutable.fromJS((Immutable.Map.isMap(argument)) ? argument.toJS(): argument);
    const pass = Immutable.is(recvImmut, argImmut)
    if (pass) {
      return {
        message: () => (
          `Immutables are equal`
        ),
        pass: true,
      };
    } else {
      return {
        message: () => {
          const diffString = diff(argImmut, recvImmut, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.toEqualImmutable') + '\n\n' +
            `Expected value to be (using Immutable.is)\n` +
            `  ${this.utils.printExpected(argument)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(received)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
          );
        },
      pass: false,
      }
    }
  },
});

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

function dummyLoggedInState() {
    const auth_expires = new Date()
    auth_expires.setHours(auth_expires.getHours() + 1)
    return {
      auth: {
        token: '', 
        is_logged_in: true, 
        expires: auth_expires
      }
    }
}
global.dummyLoggedInState = dummyLoggedInState;