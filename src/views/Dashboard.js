import React from 'react';
import PlotlyPie from './PlotlyPie';
import {Grid, Col, Row} from 'react-bootstrap';

import TransactionFilterPeriodsContainer from '../containers/TransactionFilterPeriodsContainer';


class Dashboard extends React.Component {
    componentDidMount() {
      this.props.loadSummary(this.props.filters);
    }

    render() {
        return (
          <div>
          <h3>Recent transactions</h3>
          <Grid>
            <Row>
              <Col md={10}>
                <PlotlyPie summary={this.props.summary}/>
              </Col>
              <Col md={2}>
                <div className="btn-group-vertical" role="group">
                  <TransactionFilterPeriodsContainer/>
                </div>
              </Col>
            </Row>
          </Grid>
          </div>
        );
    }
}

export default Dashboard;