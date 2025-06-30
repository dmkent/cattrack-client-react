export interface Account {
  id: string;
  name: string;
  balance: number | null;
  last_transaction: Date | null;
}

export interface SeriesPoint {
  label: string;
  value: number;
}
