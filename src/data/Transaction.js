import Immutable from 'immutable';

const Transaction = Immutable.Record({
    id: '',
    when: '',
    description: '',
    amount: '',
    category: '',
    category_name: '',
    account: ''
});

export default Transaction;