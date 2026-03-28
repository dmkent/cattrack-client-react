export interface CrossValidateRequest {
  from_date: string;
  to_date: string;
  split_ratio: number;
  random_seed?: number;
  implementation: string;
}

export interface CrossValidateSaveRequest {
  name: string;
  from_date: string;
  to_date: string;
  recalibrate_full: boolean;
  set_as_default: boolean;
  implementation: string;
  split_ratio?: number;
  random_seed?: number;
}

export interface CategoryMetric {
  category_name: string;
  correct: number;
  total: number;
  precision: number;
}

export interface FailedPrediction {
  transaction: {
    id: number;
    when: string;
    amount: string;
    description: string;
    category: number;
    category_name: string;
    account: number;
  };
  modelled: {
    id: number;
    name: string;
    score: number;
  };
}

export interface CrossValidateResult {
  status: "ok";
  random_seed: number;
  implementation: string;
  from_date: string;
  to_date: string;
  split_ratio: number;
  calibration_size: number;
  validation_size: number;
  accuracy: number;
  count: number;
  matched: number;
  category_metrics: CategoryMetric[];
  failed: FailedPrediction[];
}

export interface CrossValidateError {
  status: "error";
  message: string;
}

export type CrossValidateResponse = CrossValidateResult | CrossValidateError;

export interface SavedModel {
  url: string;
  id: number;
  name: string;
  implementation: string;
  from_date: string;
  to_date: string;
}
