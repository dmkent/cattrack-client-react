import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { PaymentSeriesItem } from "../data/PaymentSeries";
import usePaymentSeries from "../hooks/usePaymentSeries";
import { useUpdatePaymentSeries } from "../hooks/useUpdatePaymentSeries";
import PaymentSeriesDetail from "./PaymentSeriesDetail";

interface PaymentSeriesProps {}

function PaymentSeries(props: PaymentSeriesProps): JSX.Element | null {
  const { isLoading, data: paymentSeries } = usePaymentSeries();
  const { paymentSeriesAddBillFromFile } = useUpdatePaymentSeries();
  const [currentSeries, setCurrentSeries] = useState<PaymentSeriesItem | null>(
    null,
  );

  if (isLoading || !paymentSeries) {
    return null;
  }

  return (
    <Container>
      <Row>
        <Col md={2}>
          <ul>
            {paymentSeries.map((series) => {
              return (
                <li key={series.id} onClick={() => setCurrentSeries(series)}>
                  {series.name}
                </li>
              );
            })}
          </ul>
        </Col>
        <Col md={10}>
          <PaymentSeriesDetail
            series={currentSeries}
            paymentSeriesAddBillFromFile={(seriesId: string, file: File) =>
              paymentSeriesAddBillFromFile(seriesId, file)
            }
          />
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentSeries;
