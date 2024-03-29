import React from "react";
import { Col, Row } from "react-bootstrap";

import { useState } from "react";
import useCategorySeries from "../hooks/useCategorySeries";
import useCategories from "../hooks/useCategories";
import PlotlyTimeSeries from "./PlotlyTimeSeries";

export function Tracking(props) {
  const { isLoading: isCatsLoading, data: categories } = useCategories();
  const [current_category, setCategory] = useState(null);
  const { isLoading: isCatLoading, data: categorySeries } =
    useCategorySeries(current_category);

  if (isCatsLoading) {
    return null;
  }

  if (current_category === null && !isCatsLoading && categories) {
    setCategory(categories[0].id);
  }

  return (
    <div>
      <h3>Spending tracking</h3>

      <Row>
        <Col md={12}>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={current_category}
          >
            {[...categories].map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {!isCatLoading && !!categorySeries && (
            <PlotlyTimeSeries
              plot_type="bar"
              plot_invert={true}
              series={categorySeries}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Tracking;
