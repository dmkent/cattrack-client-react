export interface Bill {
  id: string;
  description: string;
  due_date: number;
  due_amount: number;
  is_paid: boolean;
}

export interface PaymentSeriesItem {
  id: string;
  name: string;
  is_income: boolean;
  next_due_date: Date | null;
  bills: Bill[];
}

export function series_from_json(json_data: any): PaymentSeriesItem {
  const bills: Bill[] = json_data.bills.map((bill: any): Bill => ({
    id: bill.id,
    description: bill.description,
    due_date: bill.due_date,
    due_amount: bill.due_amount,
    is_paid: bill.is_paid,
  }));
  
  const series: PaymentSeriesItem = {
    id: json_data.id,
    name: json_data.name,
    is_income: json_data.is_income,
    next_due_date: json_data.next_due_date ? new Date(json_data.next_due_date) : null,
    bills: bills,
  };
  
  return series;
}