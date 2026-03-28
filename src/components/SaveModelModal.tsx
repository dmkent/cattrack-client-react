import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";

export interface SaveModelValues {
  name: string;
  recalibrate_full: boolean;
  set_as_default: boolean;
}

export interface SaveModelModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (values: SaveModelValues) => void;
  isSaving: boolean;
  error?: string;
}

export function SaveModelModal({
  show,
  onHide,
  onSave,
  isSaving,
  error,
}: SaveModelModalProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveModelValues>({
    defaultValues: {
      name: "",
      recalibrate_full: true,
      set_as_default: false,
    },
  });

  const onFormSubmit: SubmitHandler<SaveModelValues> = (data) => {
    onSave(data);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Save Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="model_name">
            <Form.Label>Model name</Form.Label>
            <Form.Control
              type="text"
              maxLength={20}
              {...register("name", {
                required: "Model name is required",
                maxLength: { value: 20, message: "Maximum 20 characters" },
              })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Check
            type="checkbox"
            id="recalibrate_full"
            label="Re-train on full dataset"
            className="mb-2"
            {...register("recalibrate_full")}
          />
          <Form.Check
            type="checkbox"
            id="set_as_default"
            label="Set as default model"
            {...register("set_as_default")}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
            )}
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
