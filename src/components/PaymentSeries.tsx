import React, { useState } from "react";
import { Grid, Col, Row } from "react-bootstrap";
import PaymentSeriesDetail from "./PaymentSeriesDetail";
import usePaymentSeries from "../hooks/usePaymentSeries";
import { useUpdatePaymentSeries } from "../hooks/useUpdatePaymentSeries";

interface PaymentSeriesProps {}

function PaymentSeries(props: PaymentSeriesProps): JSX.Element | null {
  const { isLoading, data: paymentSeries } = usePaymentSeries();
  const { paymentSeriesAddBillFromFile } = useUpdatePaymentSeries();
  const [currentSeries, setCurrentSeries] = useState<string | null>(null);

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
            series={currentSeries ? paymentSeries[currentSeries] : null}
            paymentSeriesAddBillFromFile={(seriesId: string, file: File) =>
              paymentSeriesAddBillFromFile(seriesId, file)
            }
          />
        </Col>
      </Row>
    </Grid>
  );
}

export default PaymentSeries;