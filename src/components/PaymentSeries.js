import React, { useState } from "react";
import { Grid, Col, Row } from "react-bootstrap";
import PaymentSeriesDetail from "./PaymentSeriesDetail";
import usePaymentSeries from "../hooks/usePaymentSeries";
import { useUpdatePaymentSeries } from "../hooks/useUpdatePaymentSeries";

function PaymentSeries(props) {
  const { isLoading, data: paymentSeries } = usePaymentSeries();
  const { paymentSeriesAddBillFromFile } = useUpdatePaymentSeries();
  const [currentSeries, setCurrentSeries] = useState(null);

  if (isLoading || !paymentSeries) {
    return null;
  }

  return (
    <Grid>
      <Row>
        <Col md={2}>
          <ul>
            {Object.values(paymentSeries).map((series) => {
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
            series={paymentSeries[currentSeries]}
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
};

export default PaymentSeries;
