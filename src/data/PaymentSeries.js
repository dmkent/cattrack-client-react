import Immutable from 'immutable';

const PaymentSeries = Immutable.Record({
    id: '',
    name: '',
    is_income: false,
    next_due_date: null,
    bills: Immutable.List()
});

export const Bill = Immutable.Record({
    id: '',
    description: '',
    due_date: 0.0,
    due_amount: 0.0,
    is_paid: false
});

export function series_from_json(json_data) {
    const bills = Immutable.List(
        json_data.bills.map(bill => {
            return Bill(bill)
        })
    );
    const series = PaymentSeries(json_data);
    return series.set("bills", bills)
                 .set("next_due_date", series.next_due_date ? new Date(series.next_due_date) : null);
}

export default PaymentSeries;