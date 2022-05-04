import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import { Grid, Col, Row } from "react-bootstrap";

import PaymentSeriesDetailView from "./PaymentSeriesDetailView";

class PaymentSeriesView extends React.Component {
  componentDidMount() {
    this.props.loadPaymentSeries();
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={2}>
            <ul>
              {[...this.props.payment_series.values()].map((series) => {
                return (
                  <li
                    key={series.id}
                    onClick={() => this.props.selectPaymentSeries(series.id)}
                  >
                    {series.name}
                  </li>
                );
              })}
            </ul>
          </Col>
          <Col md={10}>
            <PaymentSeriesDetailView
              series={this.props.payment_series.get(this.props.current_series)}
              paymentSeriesAddBillFromFile={
                this.props.paymentSeriesAddBillFromFile
              }
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

PaymentSeriesView.propTypes = {
  loadPaymentSeries: PropTypes.func.isRequired,
  selectPaymentSeries: PropTypes.func.isRequired,
  payment_series: PropTypes.instanceOf(Immutable.Map),
  current_series: PropTypes.number,
};

export default PaymentSeriesView;
