export const ENHANCED_IMPLEMENTATION = "EnhancedSklearnCategoriser";

export interface CrossValidateRequest {
  from_date: string;
  to_date: string;
  split_ratio: number;
  random_seed?: number;
  implementation: string;
  threshold?: number;
  margin?: number;
  min_df?: number;
  max_df?: number;
  alpha?: number;
  calibration_cv?: number;
  min_category_samples?: number;
  compare_against_baseline?: boolean;
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
  threshold?: number;
  margin?: number;
  min_df?: number;
  max_df?: number;
  alpha?: number;
  calibration_cv?: number;
  min_category_samples?: number;
}

export interface CategoryMetric {
  category_name: string;
  correct: number;
  total: number;
  precision: number;
  auto_correct?: number;
  auto_total?: number;
  auto_precision?: number;
  coverage?: number;
}

export interface FailedPrediction {
  transaction: {
    url: string;
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

export interface ExcludedCategory {
  category_name: string;
  count: number;
}

export interface ComparisonBaseline {
  implementation: string;
  accuracy: number;
  overall_accuracy: number;
  auto_precision: number;
  coverage: number;
  review_count: number;
}

export interface ComparisonDelta {
  accuracy: number;
  overall_accuracy: number;
  auto_precision: number;
  coverage: number;
}

export interface CrossValidateComparison {
  baseline: ComparisonBaseline;
  delta: ComparisonDelta;
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
  overall_accuracy?: number;
  auto_matched?: number;
  auto_precision?: number;
  coverage?: number;
  review_count?: number;
  excluded_categories?: ExcludedCategory[];
  included_category_count?: number;
  included_transaction_count?: number;
  comparison?: CrossValidateComparison;
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
