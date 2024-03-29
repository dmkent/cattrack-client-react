import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Col, Row } from "react-bootstrap";

import PaymentSeriesDetail from "./PaymentSeriesDetail";
import usePaymentSeries from "../hooks/usePaymentSeries";
import paymentSeriesAddBillFromFile from "../client/payment_series";

function PaymentSeries(props) {
  const { isLoading, data: paymentSeries } = usePaymentSeries();
  const [currentSeries, setCurrentSeries] = useState(null);

  if (isLoading || !paymentSeries) {
    return null;
  }

  return (
    <Grid>
      <Row>
        <Col md={2}>
          <ul>
            {[...paymentSeries.values()].map((series) => {
              return (
                <li key={series.id} onClick={() => setCurrentSeries(series.id)}>
                  {series.name}
                </li>
              );
            })}
          </ul>
        </Col>
        <Col md={10}>
          <PaymentSeriesDetail
            series={paymentSeries.get(currentSeries)}
            paymentSeriesAddBillFromFile={(file) =>
              paymentSeriesAddBillFromFile(currentSeries, file)
            }
          />
        </Col>
      </Row>
    </Grid>
  );
}

PaymentSeries.propTypes = {
  paymentSeriesAddBillFromFile: PropTypes.func.isRequired,
};

export default PaymentSeries;
