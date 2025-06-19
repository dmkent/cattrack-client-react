class PaymentSeries {
  constructor(
    id = "",
    name = "",
    is_income = false,
    next_due_date = null,
    bills = []
  ) {
    this.id = id;
    this.name = name;
    this.is_income = is_income;
    this.next_due_date = next_due_date;
    this.bills = bills;
  }
}

export class Bill {
  constructor(
    id = "",
    description = "",
    due_date = 0.0,
    due_amount = 0.0,
    is_paid = false
  ) {
    this.id = id;
    this.description = description;
    this.due_date = due_date;
    this.due_amount = due_amount;
    this.is_paid = is_paid;
  }
}

export function series_from_json(json_data) {
  const bills = json_data.bills.map(
    (bill) =>
      new Bill(
        bill.id,
        bill.description,
        bill.due_date,
        bill.due_amount,
        bill.is_paid
      )
  );
  const series = new PaymentSeries(
    json_data.id,
    json_data.name,
    json_data.is_income,
    json_data.next_due_date ? new Date(json_data.next_due_date) : null,
    bills
  );
  return series;
}

export default PaymentSeries;
