import Immutable from 'immutable';

const Period = Immutable.Record({
    id: '',
    offset: '',

    label: '',
    from_date: '',
    to_date: '',
});

export default Period;