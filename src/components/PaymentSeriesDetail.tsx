import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { FormattedDate, FormattedNumber } from "react-intl";

import { PaymentSeriesItem } from "../data/PaymentSeries";

interface PaymentSeriesDetailProps {
  series: PaymentSeriesItem | null;
  paymentSeriesAddBillFromFile: (seriesId: string, file: File) => void;
}

function PaymentSeriesDetail(
  props: PaymentSeriesDetailProps,
): JSX.Element | null {
  if (props.series === null) {
    return null;
  }
  return (
    <Row>
      <Col md={12}>
        <p>{props.series.name}</p>
        <UploadForm
          submit_label="Add"
          uploadFile={(data) =>
            props.paymentSeriesAddBillFromFile(props.series!.id, data)
          }
        />
        <p>
          {props.series.next_due_date && (
            <FormattedDate value={props.series.next_due_date} />
          )}
        </p>
        <ul>
          {props.series.bills &&
            props.series.bills.map((bill) => {
              return (
                <li key={bill.id}>
                  <span>{bill.due_date} </span>
                  <FormattedNumber
                    value={bill.due_amount || 0.0}
                    style="currency"
                    currency="AUD"
                  />
                </li>
              );
            })}
        </ul>
      </Col>
    </Row>
  );
}

interface UploadFormProps {
  uploadFile: (file: File) => void;
  label?: string;
  submit_label?: string;
}

function UploadForm(props: UploadFormProps): JSX.Element {
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (uploadFile) {
      props.uploadFile(uploadFile);
    }
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup controlId="form-upload">
        {props.label && <FormLabel>{props.label}: </FormLabel>}
        <FormControl type="file" name="upload_file" onChange={handleChange} />
      </FormGroup>
      <Button variant="outline-secondary" size="sm" type="submit">
        {props.submit_label || "Submit"}
      </Button>
    </Form>
  );
}

export default PaymentSeriesDetail;
