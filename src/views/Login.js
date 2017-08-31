import React from 'react';
import {Redirect} from 'react-router-dom';
import {Form, FormGroup, Col, FormControl, Button, ControlLabel} from 'react-bootstrap';

import TrackActions from '../actions/TrackActions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    this.props.onLogin(this.state.username, this.state.password);
    event.preventDefault();
  }

  render() {
    var from_route;
    let from_state = this.props.location.state;
    if (from_state === undefined || from_state === "/login") {
      from_route = '/';
    } else {
      from_route = from_state.from;
    }
    if (this.props.auth.is_logged_in) {
      return (
        <Redirect to={from_route}/>
      );
    }

    return (
      <div>
        <h2>Login</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Username:
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Username" name="username"
                           onChange={this.handleChange} 
                           autoFocus/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password
            </Col>
            <Col sm={10}>
              <FormControl type="password" placeholder="Password" name="password"
                           onChange={this.handleChange} />
            </Col>
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default Login;