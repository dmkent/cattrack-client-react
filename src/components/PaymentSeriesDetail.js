import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormattedDate, FormattedNumber } from "react-intl";
import {
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  Button,
  Col,
  Row,
} from "react-bootstrap";

function PaymentSeriesDetail(props) {
  if (props.series === null || props.series === undefined) {
    return null;
  }
  return (
    <Row>
      <Col md={12}>
        <p>{props.series.name}</p>
        <UploadForm
          submit_label="Add"
          uploadFile={(data) =>
            props.paymentSeriesAddBillFromFile(props.series.id, data)
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

PaymentSeriesDetail.propTypes = {
  paymentSeriesAddBillFromFile: PropTypes.func.isRequired,
};

function UploadForm(props) {
  const [uploadFile, setUploadFile] = useState("");
  const handleChange = (event) => {
    const target = event.target;
    const files = target.files;

    setUploadFile(files[0]);
  };

  const handleSubmit = (event) => {
    props.uploadFile(uploadFile);
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup controlId="form-upload">
        {props.label && <ControlLabel>{props.label}: </ControlLabel>}
        <FormControl type="file" name="upload_file" onChange={handleChange} />
      </FormGroup>
      <Button type="submit">{props.submit_label || "Submit"}</Button>
    </Form>
  );
}

UploadForm.propTypes = {
  uploadFile: PropTypes.func.isRequired,
  label: PropTypes.string,
  submit_label: PropTypes.string,
};

export default PaymentSeriesDetail;
