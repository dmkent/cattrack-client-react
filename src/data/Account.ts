export interface Account {
  id: string;
  name: string;
  balance: number | null;
}

export interface SeriesPoint {
  label: string;
  value: number;
}
