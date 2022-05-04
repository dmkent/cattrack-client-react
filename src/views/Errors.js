import React from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

class Errors extends React.Component {
  render() {
    return (
      <div>
        {[...this.props.errors.errors.entries()].map(([idx, err]) => {
          return (
            <Alert
              key={idx}
              bsStyle="danger"
              onDismiss={() => this.props.handleAlertDismiss(idx)}
            >
              <p>{err.title}</p>
              <ul>
                {err.messages.map((message, inneridx) => {
                  return <li key={idx + "." + inneridx}>{message}</li>;
                })}
              </ul>
            </Alert>
          );
        })}
      </div>
    );
  }
}
Errors.propTypes = {
  errors: PropTypes.object.isRequired,
  handleAlertDismiss: PropTypes.func.isRequired,
};

export default Errors;
