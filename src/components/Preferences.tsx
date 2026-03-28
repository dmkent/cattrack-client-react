import { useState } from "react";
import { Alert, Button } from "react-bootstrap";

import {
  CrossValidateRequest,
  CrossValidateResult,
  SavedModel,
} from "../data/CrossValidation";
import { useCrossValidation } from "../hooks/useCrossValidation";
import { CrossValidationForm } from "./CrossValidationForm";
import { CrossValidationResults } from "./CrossValidationResults";
import { SaveModelModal, SaveModelValues } from "./SaveModelModal";

export function Preferences(): JSX.Element {
  const { runCrossValidation, saveModel, setDefaultModel } =
    useCrossValidation();

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CrossValidateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savedModel, setSavedModel] = useState<SavedModel | null>(null);

  const handleSetDefault = async () => {
    if (!savedModel) return;
    try {
      await setDefaultModel(savedModel.id);
      setSavedModel(null);
      setSuccessMessage(
        `Model "${savedModel.name}" is now the default.`,
      );
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const handleRunCrossValidation = async (request: CrossValidateRequest) => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    setSuccessMessage(null);
    setSavedModel(null);
    try {
      const cvResult = await runCrossValidation(request);
      setResult(cvResult);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async (values: SaveModelValues) => {
    if (!result) return;

    setIsSaving(true);
    setSaveError(undefined);
    try {
      const request = {
        name: values.name,
        from_date: result.from_date,
        to_date: result.to_date,
        recalibrate_full: values.recalibrate_full,
        set_as_default: values.set_as_default,
        implementation: result.implementation,
        ...(!values.recalibrate_full && {
          split_ratio: result.split_ratio,
          random_seed: result.random_seed,
        }),
      };
      const saved = await saveModel(request);
      setShowSaveModal(false);
      setResult(null);
      setSavedModel(values.set_as_default ? null : saved);
      setSuccessMessage(
        values.set_as_default
          ? `Model "${values.name}" saved and set as default.`
          : `Model "${values.name}" saved successfully.`,
      );
    } catch (e: unknown) {
      setSaveError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>Preferences</h2>
      <h4>Model Calibration</h4>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => {
            setSuccessMessage(null);
            setSavedModel(null);
          }}
        >
          {successMessage}
          {savedModel && (
            <Button
              variant="outline-success"
              size="sm"
              className="ms-3"
              onClick={handleSetDefault}
            >
              Set as Default
            </Button>
          )}
        </Alert>
      )}

      <CrossValidationForm
        onSubmit={handleRunCrossValidation}
        isRunning={isRunning}
      />

      {result && (
        <div className="mt-4">
          <CrossValidationResults
            result={result}
            onSave={() => setShowSaveModal(true)}
          />
        </div>
      )}

      <SaveModelModal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        onSave={handleSave}
        isSaving={isSaving}
        error={saveError}
      />
    </div>
  );
}
