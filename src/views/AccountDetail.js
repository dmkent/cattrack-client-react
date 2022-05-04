import React from "react";
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  ProgressBar,
  Button,
} from "react-bootstrap";
import AccountBalanceContainer from "../containers/AccountBalanceContainer";

class AccountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upload_file: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    if (this.props.accounts.current_account !== null) {
      this.props.loadAccountBalanceSeries(this.props.accounts.current_account);
    }
  }

  handleChange(event) {
    const target = event.target;
    const files = target.files;

    this.setState({
      upload_file: files[0],
    });
  }

  handleSubmit(event) {
    this.props.uploadToAccount(
      this.props.accounts.current_account,
      this.state.upload_file
    );
    event.preventDefault();
  }

  render() {
    const account_obj = this.props.accounts.current_account;
    if (account_obj === null) {
      return null;
    }
    return (
      <div>
        <h2>{account_obj.name}</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="form-upload">
            <ControlLabel>Load data: </ControlLabel>
            <FormControl
              type="file"
              name="upload_file"
              onChange={this.handleChange}
            />
            {this.props.accounts.upload_in_progress ? (
              <div>
                <span className="spinner">Loading...</span>
                <div className="progress">
                  <ProgressBar
                    now={this.props.accounts.upload_progress}
                    style="width: 60%;"
                  />
                  <span className="sr-only">
                    {this.props.accounts.upload_progress}% Complete
                  </span>
                </div>
              </div>
            ) : null}
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
        {this.props.accounts.upload_result !== null ? (
          <div
            className={
              this.props.accounts.upload_progress === 100
                ? "alert alert-sucess"
                : "alert alert-danger"
            }
          >
            {this.props.accounts.upload_result}
          </div>
        ) : null}
        <AccountBalanceContainer />
      </div>
    );
  }
}

export default AccountDetail;
