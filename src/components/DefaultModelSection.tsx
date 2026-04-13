import { useState } from "react";
import { Alert, Form } from "react-bootstrap";

import { useCategorisorList } from "../hooks/useCategorisorList";
import { useUserSettings } from "../hooks/useUserSettings";

export function DefaultModelSection(): JSX.Element | null {
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
    updateDefaultModel,
  } = useUserSettings();
  const {
    data: models,
    isLoading: modelsLoading,
    error: modelsError,
  } = useCategorisorList();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (settingsLoading || modelsLoading) return null;

  const fetchError = settingsError || modelsError;
  if (fetchError) {
    return (
      <Alert variant="danger">
        Failed to load user settings: {(fetchError as Error).message}
      </Alert>
    );
  }

  const currentModel = models?.find(
    (m) => m.id === settings?.selected_categorisor,
  );

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newId = value === "" ? null : Number(value);
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateDefaultModel(newId);
      const modelName = models?.find((m) => m.id === newId)?.name;
      setSuccessMessage(
        newId ? `Default model set to "${modelName}".` : "Default model cleared.",
      );
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h4>Default Model</h4>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {currentModel ? (
        <p>
          Current default: <strong>{currentModel.name}</strong> (
          {currentModel.implementation}, {currentModel.from_date} to{" "}
          {currentModel.to_date})
        </p>
      ) : (
        <p>No default model set.</p>
      )}

      <Form.Group className="mb-3" controlId="defaultModelSelect">
        <Form.Label>Select default model</Form.Label>
        <Form.Select
          value={settings?.selected_categorisor ?? ""}
          onChange={handleChange}
          disabled={isSaving}
        >
          <option value="">None</option>
          {models?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.implementation})
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
  );
}
