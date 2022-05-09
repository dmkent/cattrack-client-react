import React, { useState } from "react";
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ProgressBar,
  Button,
} from "react-bootstrap";
import PlotlyTimeSeries from "./PlotlyTimeSeries";

function AccountDetail(props) {
  const {
    account,
    accountSeries,
    uploadInProgress,
    uploadProgress,
    uploadResult,
  } = props;
  const [uploadFile, setUploadFile] = useState("");

  const handleChange = (event) => {
    const target = event.target;
    const files = target.files;

    setUploadFile(files[0]);
  };

  const handleSubmit = (event) => {
    props.uploadToAccount(account, uploadFile);
  };

  if (account === null) {
    return null;
  }

  return (
    <div>
      <h2>{account.name}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup controlId="form-upload">
          <ControlLabel>Load data: </ControlLabel>
          <FormControl type="file" name="upload_file" onChange={handleChange} />
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
        <Button type="submit" active={!!uploadFile}>
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
        <PlotlyTimeSeries series={accountSeries} plot_type="line" />
      )}
    </div>
  );
}

export default AccountDetail;
