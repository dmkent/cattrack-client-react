export interface ProgressPeriod {
  from_date: string;
  to_date: string;
  label: string;
}

export interface UpcomingBill {
  name: string;
  expected_date: string;
  expected_amount: string;
}

export interface ProgressRow {
  id: number;
  name: string;
  actual_spend: string;
  expected_remaining: string;
  budget: string | null;
  upcoming_bills: UpcomingBill[];
}

export interface ProgressTotals {
  actual_spend: string;
  expected_remaining: string;
  budget: string | null;
}

export interface ProgressResponse {
  period: ProgressPeriod;
  rows: ProgressRow[];
  totals: ProgressTotals;
}
