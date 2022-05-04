import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
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

class PaymentSeriesDetailView extends React.Component {
  render() {
    if (this.props.series === null || this.props.series === undefined) {
      return null;
    }
    return (
      <Row>
        <Col md={12}>
          <p>{this.props.series.name}</p>
          <UploadForm
            submit_label="Add"
            uploadFile={(data) =>
              this.props.paymentSeriesAddBillFromFile(
                this.props.series.id,
                data
              )
            }
          />
          <p>
            {this.props.series.next_due_date && (
              <FormattedDate value={this.props.series.next_due_date} />
            )}
          </p>
          <ul>
            {this.props.series.bills.size > 0 &&
              [...this.props.series.bills.values()].map((bill) => {
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
}

PaymentSeriesDetailView.propTypes = {
  series: PropTypes.instanceOf(Immutable.Record),
  paymentSeriesAddBillFromFile: PropTypes.func.isRequired,
};

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upload_file: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const files = target.files;

    this.setState({
      upload_file: files[0],
    });
  }

  handleSubmit(event) {
    this.props.uploadFile(this.state.upload_file);
    event.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId="form-upload">
          {this.props.label && (
            <ControlLabel>{this.props.label}: </ControlLabel>
          )}
          <FormControl
            type="file"
            name="upload_file"
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button type="submit">{this.props.submit_label || "Submit"}</Button>
      </Form>
    );
  }
}

UploadForm.propTypes = {
  uploadFile: PropTypes.func.isRequired,
  label: PropTypes.string,
  submit_label: PropTypes.string,
};

export default PaymentSeriesDetailView;
