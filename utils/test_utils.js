import Immutable from 'immutable'
import diff from 'jest-diff'

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
