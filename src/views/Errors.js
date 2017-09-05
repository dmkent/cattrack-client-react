import React from 'react';
import {Alert, Button} from 'react-bootstrap';

class Errors extends React.Component {
  render() {
    return (
        <div>
        {[...this.props.errors.errors.entries()].map(([idx, err]) => {
            return (<Alert key={idx} bsStyle="danger" onDismiss={() => this.props.handleAlertDismiss(idx)}>
                    <p>{err.title}</p>
                    <ul>
                    {err.messages.map(([key, val]) => {
                        return <li key={key}>{key}: {val}</li>
                    })}
                    </ul>
                    </Alert>);
        })}
        </div>
    );
  }
}

export default Errors;