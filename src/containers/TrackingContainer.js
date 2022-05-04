import { connect } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import { Col, Row } from "react-bootstrap";

import TrackActions from "../actions/TrackActions";
import CategoryPlotContainer from "../containers/CategoryPlotContainer";

export function mapStateToProps(state) {
  return {
    ...state.category,
    categories: state.categories.categories,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => {
      dispatch(TrackActions.loadCategories());
    },
    loadCategorySeries: (category_id, filters) => {
      dispatch(TrackActions.loadCategorySeries(category_id, filters));
    },
  };
}

export class Tracking extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategorySelect = this.handleCategorySelect.bind(this);
  }

  handleCategorySelect(event) {
    const val = event.target.value;
    this.props.loadCategorySeries(val, {});
  }

  componentDidMount() {
    this.props.loadCategories();
    this.props.loadCategorySeries(12, {});
  }

  render() {
    return (
      <div>
        <h3>Spending tracking</h3>

        <Row>
          <Col md={12}>
            <select onChange={this.handleCategorySelect}>
              {[...this.props.categories.values()].map((category) => {
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
            <CategoryPlotContainer />
          </Col>
        </Row>
      </div>
    );
  }
}
Tracking.propTypes = {
  loadCategories: PropTypes.func.isRequired,
  loadCategorySeries: PropTypes.func.isRequired,
  categories: PropTypes.instanceOf(Immutable.List).isRequired,
};

const TrackingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tracking);

export default TrackingContainer;
