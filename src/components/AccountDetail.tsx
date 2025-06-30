import { useState } from "react";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  ProgressBar,
  Button,
} from "react-bootstrap";

import { Account, SeriesPoint } from "../data/Account";
import { PlotlyTimeSeries } from "./PlotlyTimeSeries";

export interface AccountDetailProps {
  account: Account | null;
  accountSeries?: SeriesPoint[];
  uploadInProgress: boolean;
  uploadProgress: number;
  uploadResult: string | null;
  uploadToAccount: (
    account: Account,
    file: File,
    fromDate: string | null,
    toDate: string | null,
  ) => void;
}

export function AccountDetail(props: AccountDetailProps): JSX.Element | null {
  const {
    account,
    accountSeries,
    uploadInProgress,
    uploadProgress,
    uploadResult,
  } = props;
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (account && uploadFile) {
      props.uploadToAccount(account, uploadFile, fromDate, toDate);
    }
    event.preventDefault();
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
          <FormControl type="file" name="upload_file" onChange={handleChange} />
          <FormControl
            type="date"
            aria-label="Date from"
            max={toDate ?? undefined}
            min={undefined}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <FormControl
            type="date"
            aria-label="Date to"
            max={undefined}
            min={fromDate ?? undefined}
            onChange={(e) => setToDate(e.target.value)}
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
        <Button type="submit" variant="dark" active={!!uploadFile}>
          Submit
        </Button>
      </Form>
      {uploadResult !== null ? (
        <div
          className={
            uploadProgress === 100 ? "alert alert-sucess" : "alert alert-danger"
          }
        >
          {uploadResult}
        </div>
      ) : null}
      {!!accountSeries && (
        <PlotlyTimeSeries series={accountSeries} plot_type="scatter" />
      )}
    </div>
  );
}
