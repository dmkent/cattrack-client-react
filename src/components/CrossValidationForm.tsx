import { Accordion, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  CrossValidateRequest,
  ENHANCED_IMPLEMENTATION,
} from "../data/CrossValidation";

export interface CrossValidationFormProps {
  onSubmit: (request: CrossValidateRequest) => void;
  isRunning: boolean;
}

type FormInputs = {
  from_date: string;
  to_date: string;
  split_ratio: string;
  random_seed: string;
  implementation: string;
  alpha: string;
  threshold: string;
  margin: string;
  min_df: string;
  max_df: string;
  calibration_cv: string;
  min_category_samples: string;
  compare_against_baseline: boolean;
};

const toNumberOrUndefined = (value: string): number | undefined => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export function CrossValidationForm({
  onSubmit,
  isRunning,
}: CrossValidationFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      split_ratio: "0.5",
      implementation: "SklearnCategoriser",
      random_seed: "",
      alpha: "",
      threshold: "",
      margin: "",
      min_df: "",
      max_df: "",
      calibration_cv: "",
      min_category_samples: "",
      compare_against_baseline: false,
    },
  });

  const implementation = watch("implementation");
  const isEnhanced = implementation === ENHANCED_IMPLEMENTATION;

  const onFormSubmit: SubmitHandler<FormInputs> = (data) => {
    // Cross-field validation (e.g. min_df <= max_df, threshold > margin) is
    // left to the backend; surfaced via the existing error-alert path.
    const request: CrossValidateRequest = {
      from_date: data.from_date,
      to_date: data.to_date,
      split_ratio: Number(data.split_ratio),
      implementation: data.implementation,
    };
    const seed = toNumberOrUndefined(data.random_seed);
    if (seed !== undefined) {
      request.random_seed = seed;
    }
    const alpha = toNumberOrUndefined(data.alpha);
    if (alpha !== undefined) {
      request.alpha = alpha;
    }
    if (data.implementation === ENHANCED_IMPLEMENTATION) {
      const threshold = toNumberOrUndefined(data.threshold);
      if (threshold !== undefined) request.threshold = threshold;
      const margin = toNumberOrUndefined(data.margin);
      if (margin !== undefined) request.margin = margin;
      const minDf = toNumberOrUndefined(data.min_df);
      if (minDf !== undefined) request.min_df = minDf;
      const maxDf = toNumberOrUndefined(data.max_df);
      if (maxDf !== undefined) request.max_df = maxDf;
      const calibrationCv = toNumberOrUndefined(data.calibration_cv);
      if (calibrationCv !== undefined) request.calibration_cv = calibrationCv;
      const minCategorySamples = toNumberOrUndefined(data.min_category_samples);
      if (minCategorySamples !== undefined) {
        request.min_category_samples = minCategorySamples;
      }
      if (data.compare_against_baseline) {
        request.compare_against_baseline = true;
      }
    }
    onSubmit(request);
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <Row className="mb-3">
        <Form.Group as={Col} sm={6} controlId="from_date">
          <Form.Label>From date</Form.Label>
          <Form.Control
            type="date"
            {...register("from_date", { required: "From date is required" })}
            isInvalid={!!errors.from_date}
          />
          <Form.Control.Feedback type="invalid">
            {errors.from_date?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} sm={6} controlId="to_date">
          <Form.Label>To date</Form.Label>
          <Form.Control
            type="date"
            {...register("to_date", { required: "To date is required" })}
            isInvalid={!!errors.to_date}
          />
          <Form.Control.Feedback type="invalid">
            {errors.to_date?.message}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} sm={3} controlId="split_ratio">
          <Form.Label>Split ratio</Form.Label>
          <Form.Control
            type="number"
            step={0.1}
            min={0.1}
            max={0.9}
            {...register("split_ratio", {
              required: "Split ratio is required",
              min: { value: 0.1, message: "Minimum is 0.1" },
              max: { value: 0.9, message: "Maximum is 0.9" },
            })}
            isInvalid={!!errors.split_ratio}
          />
          <Form.Control.Feedback type="invalid">
            {errors.split_ratio?.message}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Fraction of transactions used to train the model; the remainder are
            held back to validate it.
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col} sm={3} controlId="implementation">
          <Form.Label>Implementation</Form.Label>
          <Form.Select {...register("implementation")}>
            <option value="SklearnCategoriser">SklearnCategoriser</option>
            <option value="EnhancedSklearnCategoriser">
              EnhancedSklearnCategoriser
            </option>
          </Form.Select>
          <Form.Text className="text-muted">
            Enhanced adds probability calibration, confidence gating and
            sparse-category exclusion on top of the base model.
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col} sm={3} controlId="alpha">
          <Form.Label>Alpha</Form.Label>
          <Form.Control
            type="number"
            step={0.0001}
            min={0}
            placeholder="0.001 (default)"
            {...register("alpha", {
              min: { value: 0, message: "Minimum is 0" },
            })}
            isInvalid={!!errors.alpha}
          />
          <Form.Control.Feedback type="invalid">
            {errors.alpha?.message}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            L2 regularisation strength for the classifier. Higher values
            simplify the model and reduce overfitting.
          </Form.Text>
        </Form.Group>
        <Form.Group as={Col} sm={3} controlId="random_seed">
          <Form.Label>Random seed (optional)</Form.Label>
          <Form.Control type="number" {...register("random_seed")} />
          <Form.Text className="text-muted">
            Fixes the train/validation split so a run can be reproduced
            exactly. Leave blank for a random split.
          </Form.Text>
        </Form.Group>
      </Row>
      {isEnhanced && (
        <>
          <Accordion className="mb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Advanced options</Accordion.Header>
              <Accordion.Body>
                <Row className="mb-3">
                  <Form.Group as={Col} sm={4} controlId="threshold">
                    <Form.Label>Threshold</Form.Label>
                    <Form.Control
                      type="number"
                      step={0.05}
                      min={0}
                      max={1}
                      placeholder="0.6 (default)"
                      {...register("threshold", {
                        min: { value: 0, message: "Minimum is 0" },
                        max: { value: 1, message: "Maximum is 1" },
                      })}
                      isInvalid={!!errors.threshold}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.threshold?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Minimum confidence the top category must reach before a
                      transaction is auto-categorised. Predictions below this go
                      to manual review. Higher = more conservative.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} sm={4} controlId="margin">
                    <Form.Label>Margin</Form.Label>
                    <Form.Control
                      type="number"
                      step={0.05}
                      min={0}
                      max={1}
                      placeholder="0.15 (default)"
                      {...register("margin", {
                        min: { value: 0, message: "Minimum is 0" },
                        max: { value: 1, message: "Maximum is 1" },
                      })}
                      isInvalid={!!errors.margin}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.margin?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      How far ahead of the runner-up the top category must be to
                      be auto-applied. Guards against close, ambiguous calls.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} sm={4} controlId="calibration_cv">
                    <Form.Label>Calibration CV splits</Form.Label>
                    <Form.Control
                      type="number"
                      step={1}
                      min={2}
                      placeholder="5 (default)"
                      {...register("calibration_cv", {
                        min: { value: 2, message: "Minimum is 2" },
                      })}
                      isInvalid={!!errors.calibration_cv}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.calibration_cv?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Cross-validation folds used to calibrate the predicted
                      probabilities. Categories with fewer transactions than
                      this are dropped from training.
                    </Form.Text>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} sm={4} controlId="min_df">
                    <Form.Label>Min document frequency</Form.Label>
                    <Form.Control
                      type="number"
                      step={1}
                      min={0}
                      placeholder="1 (default)"
                      {...register("min_df", {
                        min: { value: 0, message: "Must be non-negative" },
                      })}
                      isInvalid={!!errors.min_df}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.min_df?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Ignore description terms that appear in fewer transactions
                      than this. A whole number is a transaction count; a
                      decimal ≤ 1 is a proportion. Raise it to drop rare noise.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} sm={4} controlId="max_df">
                    <Form.Label>Max document frequency</Form.Label>
                    <Form.Control
                      type="number"
                      step={0.05}
                      min={0}
                      placeholder="1.0 (default)"
                      {...register("max_df", {
                        min: { value: 0, message: "Must be non-negative" },
                      })}
                      isInvalid={!!errors.max_df}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.max_df?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Ignore description terms that appear in more transactions
                      than this. A whole number is a transaction count; a
                      decimal ≤ 1 is a proportion. Lower it to drop overly
                      common terms.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    sm={4}
                    controlId="min_category_samples"
                  >
                    <Form.Label>Min samples per category</Form.Label>
                    <Form.Control
                      type="number"
                      step={1}
                      min={1}
                      placeholder="3 (default)"
                      {...register("min_category_samples", {
                        min: { value: 1, message: "Minimum is 1" },
                      })}
                      isInvalid={!!errors.min_category_samples}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.min_category_samples?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Categories with fewer transactions than this are excluded
                      from training entirely (listed in the results).
                    </Form.Text>
                  </Form.Group>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="compare_against_baseline"
              label="Compare against SklearnCategoriser baseline"
              {...register("compare_against_baseline")}
            />
            <Form.Text className="text-muted">
              Also trains the base SklearnCategoriser on the same split and
              reports how the enhanced model's metrics compare.
            </Form.Text>
          </Form.Group>
        </>
      )}
      <Button type="submit" variant="primary" disabled={isRunning}>
        {isRunning && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-label="Running"
            className="me-2"
          />
        )}
        Run Cross-Validation
      </Button>
    </Form>
  );
}
