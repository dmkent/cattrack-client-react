export interface RecategorisePreviewItem {
  transaction: {
    id: number;
    when: string;
    amount: string;
    description: string;
    category: number;
    category_name: string;
    account: number;
  };
  current_category: {
    id: number | null;
    name: string | null;
  };
  suggested_category: {
    id: number;
    name: string;
    score: number;
  };
}

export interface RecategorisePreviewResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecategorisePreviewItem[];
}

export interface RecategoriseUpdate {
  transaction: number;
  category: number;
}

export interface RecategoriseApplyResponse {
  updated_count: number;
}
