import React, { Component } from "react";
import { login } from "../../util/APIUtils";
import "./Login.css";
import { AUTH_TOKEN, NRIC_LENGTH } from "../../constants";
import { Form, Input, Button, Icon, Select, notification, Spin } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

class Login extends Component {
  render() {
    const AntWrappedLoginForm = Form.create()(LoginForm);
    return (
      <div className="login-container">
        <h1 className="page-title">Login</h1>
        <div className="login-content">
          <AntWrappedLoginForm onLogin={this.props.onLogin} />
        </div>
      </div>
    );
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      nric: "",
      password: "",
      role: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  isFormInvalid() {
    return !(
      this.state.nric.validateStatus === "success" &&
      this.state.password.validateStatus === "success"
    );
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const loginRequest = {
      nric: this.state.nric.value,
      password: this.state.password.value,
      role: this.state.role.value
    };
    login(loginRequest)
      .then(response => {
        localStorage.setItem(AUTH_TOKEN, response.token);
        this.props.onLogin();
      })
      .catch(error => {
        if (error.status === 401) {
          notification.error({
            message: "EquiV",
            description:
              "Your NRIC/Password/Role is/are incorrect. Please try again!"
          });
        } else {
          notification.error({
            message: "EquiV",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  }

  render() {
    return (
      <Spin spinning={this.state.isLoading}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem
            label="NRIC"
            hasFeedback
            validateStatus={this.state.nric.validateStatus}
            help={this.state.nric.errorMsg}
          >
            <Input
              prefix={<Icon type="user" />}
              size="large"
              name="nric"
              value={this.state.nric.value}
              onChange={event => {
                this.handleInputChange(event, this.validateNric);
              }}
              placeholder="NRIC"
            />
          </FormItem>
          <FormItem
            label="Password"
            hasFeedback
            validateStatus={this.state.password.validateStatus}
            help={this.state.password.errorMsg}
          >
            <Input
              prefix={<Icon type="lock" />}
              size="large"
              name="password"
              type="password"
              onChange={event => {
                this.handleInputChange(event, this.validatePassword);
              }}
              placeholder="Password"
            />
          </FormItem>
          <FormItem label="Role">
            <Select
              size="large"
              name="role"
              autoComplete="off"
              onChange={value =>
                this.setState({
                  role: {
                    value: value
                  }
                })
              }
              placeholder="Select your role"
            >
              <Option value="seller">Seller</Option>
              <Option value="buyer">Buyer</Option>
              <Option value="evaluator">Evaluator</Option>
              <Option value="dealer">Dealer</Option>
              <Option value="middleman">Middleman</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={this.isFormInvalid()}
            >
              Login
            </Button>
          </FormItem>
        </Form>
      </Spin>
    );
  }

  validateNric = nric => {
    if (!nric) {
      return {
        validateStatus: "error",
        errorMsg: "NRIC may not be empty"
      };
    }

    const NRIC_REGEX = RegExp("^[STFG]\\d{7}[A-Z]$");
    if (!NRIC_REGEX.test(nric)) {
      return {
        validateStatus: "error",
        errorMsg: "NRIC not valid"
      };
    }

    if (nric.length < NRIC_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `NRIC is too short (${NRIC_LENGTH} characters needed.)`
      };
    } else if (nric.length > NRIC_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `NRIC is too long (${NRIC_LENGTH} characters allowed.)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validatePassword = password => {
    if (!password) {
      return {
        validateStatus: "error",
        errorMsg: "Password may not be empty"
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };
}

export default Login;
