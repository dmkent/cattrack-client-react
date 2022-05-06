import React from "react";
import PlotlyPie from "./PlotlyPie";
import { Grid, Col, Row, Well } from "react-bootstrap";

import TransactionFilterPeriods from "../components/TransactionFilterPeriods";
import BudgetSummaryContainer from "../containers/BudgetSummary";

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.loadSummary(this.props.filters);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col md={6}>
              <BudgetSummaryContainer />
            </Col>
            <Col md={6}>
              <Well>TODO: put upcoming bills here</Well>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <PlotlyPie summary={this.props.summary} />
            </Col>
            <Col md={2}>
              <div className="btn-group-vertical" role="group">
                <TransactionFilterPeriods
                  filters={this.props.filters}
                  periods={this.props.periods}
                  setFilters={this.props.onFilter}
                />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
