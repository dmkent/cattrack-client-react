import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

import { CrossValidateRequest } from "../data/CrossValidation";

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
};

export function CrossValidationForm({
  onSubmit,
  isRunning,
}: CrossValidationFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      split_ratio: "0.5",
      implementation: "SklearnCategoriser",
      random_seed: "",
    },
  });

  const onFormSubmit: SubmitHandler<FormInputs> = (data) => {
    const request: CrossValidateRequest = {
      from_date: data.from_date,
      to_date: data.to_date,
      split_ratio: Number(data.split_ratio),
      implementation: data.implementation,
    };
    if (data.random_seed) {
      request.random_seed = Number(data.random_seed);
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
        <Form.Group as={Col} sm={4} controlId="split_ratio">
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
        </Form.Group>
        <Form.Group as={Col} sm={4} controlId="implementation">
          <Form.Label>Implementation</Form.Label>
          <Form.Select {...register("implementation")}>
            <option value="SklearnCategoriser">SklearnCategoriser</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} sm={4} controlId="random_seed">
          <Form.Label>Random seed (optional)</Form.Label>
          <Form.Control
            type="number"
            {...register("random_seed")}
          />
        </Form.Group>
      </Row>
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
