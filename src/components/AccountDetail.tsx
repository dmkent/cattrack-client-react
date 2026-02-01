import { useState, useEffect, useRef } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  ProgressBar,
  Button,
  Alert,
} from "react-bootstrap";

import { Account, SeriesPoint } from "../data/Account";
import { useUpdateAccounts } from "../hooks/useUpdateAccounts";
import { PlotlyTimeSeries } from "./PlotlyTimeSeries";

export interface AccountDetailProps {
  account: Account | null;
  accountSeries?: SeriesPoint[];
}

export function AccountDetail(props: AccountDetailProps): JSX.Element | null {
  const { account, accountSeries } = props;
  const { uploadFileToAccount } = useUpdateAccounts();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadResult, setUploadResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!account || !uploadFile) {
      return;
    }

    // Clear any existing success timer
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }

    setUploadInProgress(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      await uploadFileToAccount(
        account,
        uploadFile,
        fromDate,
        toDate,
        (progress) => {
          setUploadProgress(progress);
        },
      );

      setUploadResult({
        type: "success",
        message: "File uploaded successfully",
      });

      // Auto-clear success message after 5 seconds
      successTimerRef.current = setTimeout(() => {
        setUploadResult(null);
        successTimerRef.current = null;
      }, 5000);

      // Reset form
      setUploadFile(null);
      setFromDate(null);
      setToDate(null);

      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadResult({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setUploadInProgress(false);
    }
  };

  if (account === null) {
    return null;
  }

  return (
    <div>
      <h2>{account.name}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup controlId="form-upload">
          <FormLabel>Load data: </FormLabel>
          <FormControl
            type="file"
            name="upload_file"
            onChange={handleChange}
            disabled={uploadInProgress}
          />
          <FormControl
            type="date"
            aria-label="Date from"
            max={toDate ?? undefined}
            min={undefined}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={uploadInProgress}
            value={fromDate ?? ""}
          />
          <FormControl
            type="date"
            aria-label="Date to"
            max={undefined}
            min={fromDate ?? undefined}
            onChange={(e) => setToDate(e.target.value)}
            disabled={uploadInProgress}
            value={toDate ?? ""}
          />
          {uploadInProgress ? (
            <div>
              <span className="spinner">Loading...</span>
              <div className="progress">
                <ProgressBar now={uploadProgress} style={{ width: "60%" }} />
                <span className="sr-only">{uploadProgress}% Complete</span>
              </div>
            </div>
          ) : null}
        </FormGroup>
        <Button
          type="submit"
          variant="dark"
          active={!!uploadFile}
          disabled={uploadInProgress || !uploadFile}
        >
          {uploadInProgress ? "Uploading..." : "Submit"}
        </Button>
      </Form>
      {uploadResult !== null && (
        <Alert
          variant={uploadResult.type === "success" ? "success" : "danger"}
          dismissible={uploadResult.type === "error"}
          onClose={() => setUploadResult(null)}
          className="mt-3"
        >
          {uploadResult.message}
        </Alert>
      )}
      {!!accountSeries && (
        <PlotlyTimeSeries series={accountSeries} plot_type="scatter" />
      )}
    </div>
  );
}
