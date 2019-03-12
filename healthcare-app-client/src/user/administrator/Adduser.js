import React, { Component } from 'react';
import { signup } from '../../util/APIUtils';
import './Adduser.css';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    NRIC_LENGTH,
    EMAIL_MAX_LENGTH,
    PHONE_LENGTH,
    POSTALCODE_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH,
} from '../../constants';

import { Form, Input, Button, Select, notification } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Administrator_add_user extends Component {
  constructor(props) {
        super(props);
        this.state = {
          nric: '',
          name: '',
          email: '',
          phone: '',
          address: '',
          postalCode: '',
          age: '',
          gender: '',
          password: '',
          roles: '',
          publicKey: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const adduserRequest = {
            nric: encodeURIComponent(this.state.nric.value),
            name: this.state.name.value,
            email: this.state.email.value,
            phone: encodeURIComponent(this.state.phone.value),
            address: this.state.address.value,
            postalCode: encodeURIComponent(this.state.postalCode.value),
            age: encodeURIComponent(this.state.age.value),
            gender: encodeURIComponent(this.state.gender.value),
            password: this.state.password.value,
            roles: this.state.roles.value,
            publicKey: this.state.publicKey.value
        };
        signup(adduserRequest)
        .then(response => {
            notification.success({
                message: 'Healthcare App',
                description: "You've successfully registered a new user!",
            });
            this.props.history.push("/manageusers");
        }).catch(error => {
            notification.error({
                message: 'Healthcare App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.nric.validateStatus === 'success' &&
            this.state.name.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.phone.validateStatus === 'success' &&
            this.state.address.validateStatus === 'success' &&
            this.state.postalCode.validateStatus === 'success' &&
            this.state.age.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success' &&
            this.state.publicKey.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="adduser-container">
                <h1 className="page-title">Add User</h1>
                <div className="adduser-content">
                    <Form onSubmit={this.handleSubmit} className="adduser-form">
                        <FormItem
                          label="NRIC"
                          hasFeedback
                          validateStatus={this.state.nric.validateStatus}
                          help={this.state.nric.errorMsg}>
                          <Input
                              size="large"
                              name="nric"
                              autoComplete="off"
                              value={this.state.nric.value}
                              onChange={(event) => {this.handleInputChange(event, this.validateNric)}}  />
                        </FormItem>
                        <FormItem
                            label="Full Name"
                            hasFeedback
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                value={this.state.name.value}
                                onChange={(event) => {this.handleInputChange(event, this.validateName)}}  />
                        </FormItem>
                        <FormItem
                            label="Email"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                onBlur={this.validateEmailAvailability}
                                value={this.state.email.value}
                                onChange={(event) => {this.handleInputChange(event, this.validateEmail)}} />
                        </FormItem>
                        <FormItem
                            label="Phone"
                            hasFeedback
                            validateStatus={this.state.phone.validateStatus}
                            help={this.state.phone.errorMsg}>
                            <Input
                                size="large"
                                name="phone"
                                autoComplete="off"
                                value={this.state.phone.value}
                                onChange={(event) => {this.handleInputChange(event, this.validatePhone)}} />
                        </FormItem>
                        <FormItem
                            label="Address"
                            hasFeedback
                            validateStatus={this.state.address.validateStatus}
                            help={this.state.address.errorMsg}>
                            <Input
                                size="large"
                                name="address"
                                autoComplete="off"
                                value={this.state.address.value}
                                onChange={(event) => {this.handleInputChange(event, this.validateAddress)}} />
                        </FormItem>
                        <FormItem
                            label="Postal Code"
                            hasFeedback
                            validateStatus={this.state.postalCode.validateStatus}
                            help={this.state.postalCode.errorMsg}>
                            <Input
                                size="large"
                                name="postalCode"
                                autoComplete="off"
                                value={this.state.postalCode.value}
                                onChange={(event) => {this.handleInputChange(event, this.validatePostalCode)}} />
                        </FormItem>
                        <FormItem
                            label="Age"
                            hasFeedback
                            validateStatus={this.state.age.validateStatus}
                            help={this.state.age.errorMsg}>
                            <Input
                                size="large"
                                name="age"
                                autoComplete="off"
                                value={this.state.age.value}
                                onChange={(event) => {this.handleInputChange(event, this.validateAge)}} />
                        </FormItem>
                        <FormItem
                            label="Gender">
                            <Select
                                size="large"
                                name="gender"
                                autoComplete="off"
                                onChange={(value) => this.setState({
                                    gender : {
                                        value: value
                                    }})}>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="Password"
                            hasFeedback
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="Between 8 to 100 characters"
                                value={this.state.password.value}
                                onChange={(event) => {this.handleInputChange(event, this.validatePassword)}} />
                        </FormItem>
                        <FormItem
                            label="Roles">
                            <Select mode="multiple" placeholder="Select the relevant roles"
                                size="large"
                                name="roles"
                                autoComplete="off"
                                onChange={(value) => this.setState({
                                    roles : {
                                        value: value
                                    }})}>
                                <Option value="patient">Patient</Option>
                                <Option value="therapist">Therapist</Option>
                                <Option value="researcher">Researcher</Option>
                                <Option value="external partner">External Partner</Option>
                                <Option value="administrator">Administrator</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label="Public Key"
                            hasFeedback
                            validateStatus={this.state.publicKey.validateStatus}>
                            <Input
                                size="large"
                                name="publicKey"
                                autoComplete="off"
                                value={this.state.publicKey.value}
                                onChange={(event) => {this.handleInputChange(event, this.validatePublicKey)}} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="adduser-form-button"
                                disabled={this.isFormInvalid()}>Add user</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateNric = (nric) => {
        if(!nric) {
          return {
            validateStatus: 'error',
            errorMsg: 'NRIC may not be empty'
          }
        }

        const NRIC_REGEX = RegExp('^[STFG]\\d{7}[A-Z]$');
        if(!NRIC_REGEX.test(nric)) {
            return {
                validateStatus: 'error',
                errorMsg: 'NRIC not valid'
            }
        }

        if(nric.length < NRIC_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `NRIC is too short (${NRIC_LENGTH} characters needed.)`
            }
        } else if (nric.length > NRIC_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `NRIC is too long (${NRIC_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateName = (name) => {
        if(!name) {
            return {
                validateStatus: 'error',
                errorMsg: 'Name may not be empty'
              }
        }

        if(name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validatePhone = (phone) => {
        if(!phone) {
            return {
                validateStatus: 'error',
                errorMsg: 'Phone may not be empty'
            }
        }

        const PHONE_REGEX = RegExp('^[0-9]*$');
        if(!PHONE_REGEX.test(phone)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Phone not valid'
            }
        }

        if(phone.length < PHONE_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Phone is too short (${PHONE_LENGTH} characters needed.)`
            }
        } else if (phone.length > PHONE_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Phone is too long (${PHONE_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateAddress = (address) => {
        if(!address) {
            return {
                validateStatus: 'error',
                errorMsg: 'Address may not be empty'
              }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validatePostalCode = (postalCode) => {
        if(!postalCode) {
            return {
                validateStatus: 'error',
                errorMsg: 'Postal code may not be empty'
              }
        }

        const POSTALCODE_REGEX = RegExp('[0][1-9][0-9]{4}|[1-6][0-9]{5}|[7][012356789][0-9]{4}|[8][0-2][0-9]{4}');
        if(!POSTALCODE_REGEX.test(postalCode)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Postal code not valid'
            }
        }

        if(postalCode.length < POSTALCODE_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Postal code is too short (${POSTALCODE_LENGTH} characters needed.)`
            }
        } else if (postalCode.length > POSTALCODE_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Postal code is too long (${POSTALCODE_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateAge = (age) => {
        if(!age) {
            return {
                validateStatus: 'error',
                errorMsg: 'Age may not be empty'
              }
        }

        const AGE_REGEX = RegExp('^[0-9]*$');
        if(!AGE_REGEX.test(age)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Age not valid'
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validatePassword = (password) => {
      if(!password) {
        return {
          validateStatus: 'error',
          errorMsg: 'Password may not be empty'
        }
      }

        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validatePublicKey = (publicKey) => {
        if(!publicKey) {
            return {
                validateStatus: 'error',
                errorMsg: 'Public key may not be empty'
              }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }
}

export default Administrator_add_user;
