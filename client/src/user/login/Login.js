import React, { Component } from 'react';
import { login, getServerSignature, verifyTagSignature } from '../../util/APIUtils';
import './Login.css';
import { AUTH_TOKEN, NRIC_LENGTH } from '../../constants';
import { convertBase64StrToUint8Array, wait, splitByMaxLength,
dis, concatenate, getTagSigAndMsg, writeUid, readUid, disconUid } from '../../util/MFAUtils';
import { Form, Input, Button, Icon, Select, notification, Spin } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;


var encoder = new TextEncoder('utf-8');
var writeChar, readChar, disconnectChar, deviceConnected;
var valueRecArray = [];


class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
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
          nric: '',
          password: '',
          role: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    isFormInvalid() {
        return !(this.state.nric.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    startConnection() {
       valueRecArray = [];
       let context = this;
       var ivStr;
       this.setState({isLoading:true});
       navigator.bluetooth.requestDevice({
         filters: [ {services:[0x2220]}]
       })
         .then(device => {
           deviceConnected = device;
           context.setState({loading:true});
           return device.gatt.connect();
         })
         .then(server => {
           return server.getPrimaryService(0x2220);
         })
         .then(service => {
           return service.getCharacteristics();
         })
         .then(charArray => {
           for (let char of charArray) {
             if (char.properties.write === true && char.uuid.startsWith(writeUid)) {
               writeChar = char;
             }
             if (char.properties.read === true && char.uuid.startsWith(readUid)) {
               readChar = char;
             }
             if (char.uuid.startsWith(disconUid)) {
               disconnectChar = char;
             }
           }
           const loginRequest = {
               nric: context.state.nric.value,
               password: context.state.password.value,
               role: context.state.role.value,
           };
           getServerSignature(loginRequest)
           .then(response => {
               ivStr = response.iv;
               let combined = convertBase64StrToUint8Array(response.combined);
               let signature = convertBase64StrToUint8Array(response.signature);
               let iv = convertBase64StrToUint8Array(ivStr);
               let stringEnder = encoder.encode("//");
               let sendMsg = concatenate(Uint8Array, combined, signature, stringEnder);
               let numOfChunks = Math.ceil(sendMsg.byteLength / 20);
               var msgChunks = splitByMaxLength(sendMsg, numOfChunks);
               var prevPromise = Promise.resolve();
               for (let i=0; i< numOfChunks; i++) {
                  prevPromise = prevPromise.then(function() {
                    return writeChar.writeValue(msgChunks[i]).then(function() {
                      if (i === numOfChunks-1) {
                        wait(11000);
                          var prevWhilePromise = Promise.resolve();
                          for (let j=0; j< 7; j++) {
                             prevWhilePromise = prevWhilePromise.then(function() {
                               return readChar.readValue().then(value => {
                                 let valueRec = new Uint8Array(value.buffer);
                                 if (valueRec[0]===48 && valueRec[1]===48 && j===0) {
                                   context.setState({isLoading: false});
                                   dis(disconnectChar);
                                   openNotificationError(0);
                                 }
                                 if (valueRec[0]===33 && valueRec[1]===33) {
                                   context.setState({isLoading: false});
                                   dis(disconnectChar);
                                   openNotificationError(1);
                                 }
                                 for (let i=0; i<value.buffer.byteLength; i++) {
                                   valueRecArray.push(valueRec[i]);
                                 }
                                 let ack = "ACK" + j;
                                 ack = encoder.encode(ack);
                                 return writeChar.writeValue(ack).then(function() {
                                   if (j===6) {
                                     dis(disconnectChar);
                                     let encryptedMsg = getTagSigAndMsg(valueRecArray);
                                     let ivMsg = {iv: ivStr};
                                     let reqToSend =  Object.assign({}, encryptedMsg, ivMsg, loginRequest);
                                     verifyTagSignature(reqToSend)
                                      .then(response => {
                                        localStorage.setItem(AUTH_TOKEN, response.sessionId);
                                        context.setState({isLoading: false});
                                        context.props.onLogin();
                                      }).catch(error => {
                                        context.setState({isLoading: false});
                                        notification.error({
                                            message: 'EquiV',
                                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                                        });
                                      })
                                    }
                                 })
                               })
                             })
                           }
                         }
                      })
                    }).catch(error => {
                        context.setState({isLoading: false});
                        notification.error({
                            message: 'EquiV',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    })
                  }
                }).catch(error => {
                    context.setState({isLoading: false});
                    if(error.status === 401) {
                        notification.error({
                            message: 'EquiV',
                            description: 'Your NRIC/Password/Role is/are incorrect. Please try again!'
                        });
                    } else {
                        notification.error({
                            message: 'EquiV',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                })
            }).catch(error => {
               context.setState({isLoading: false});
               notification.error({
                   message: 'EquiV',
                   description: error.message || 'Sorry! Something went wrong. Please try again!'
               });
            })
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
        const loginRequest = {
            nric: this.state.nric.value,
            password: this.state.password.value,
            role: this.state.role.value,
        };
        login(loginRequest)
        .then(response => {
            localStorage.setItem(AUTH_TOKEN, response.sessionId);
            this.props.onLogin();
        }).catch(error => {
            if(error.status === 401) {
                notification.error({
                    message: 'EquiV',
                    description: 'Your NRIC/Password/Role is/are incorrect. Please try again!'
                });
            } else {
                notification.error({
                    message: 'EquiV',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
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
                help={this.state.nric.errorMsg}>
                    <Input
                        prefix={<Icon type="user" />}
                        size="large"
                        name="nric"
                        value={this.state.nric.value}
                        onChange={(event) => {this.handleInputChange(event, this.validateNric)}}
                        placeholder="NRIC" />
                </FormItem>
                <FormItem
                label="Password"
                hasFeedback
                validateStatus={this.state.password.validateStatus}
                help={this.state.password.errorMsg}>
                    <Input
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password"
                        type="password"
                        onChange={(event) => {this.handleInputChange(event, this.validatePassword)}}
                        placeholder="Password"  />
                </FormItem>
                <FormItem
                    label="Role">
                    <Select
                        size="large"
                        name="role"
                        autoComplete="off"
                        onChange={(value) => this.setState({
                            role : {
                                value: value
                            }})}
                        placeholder="Select your role">
                        <Option value="patient">Patient</Option>
                        <Option value="therapist">Therapist</Option>
                        <Option value="researcher">Researcher</Option>
                        <Option value="external_partner">External Partner</Option>
                        <Option value="administrator">Administrator</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button" disabled={this.isFormInvalid()}>Login without your tag</Button>
                    <Button type="primary" className="mfa-button" size="large" onClick={this.startConnection.bind(this)} disabled={this.isFormInvalid()}> Connect Your Tag To Log In </Button>
                </FormItem>
            </Form>
            </Spin>
        );
    }

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

    validatePassword = (password) => {
      if(!password) {
        return {
          validateStatus: 'error',
          errorMsg: 'Password may not be empty'
        }
      } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

function openNotificationError(type) {
  if (type===0) {
    notification["error"]({
     message: 'EquiV',
     description: 'Connection timed out',
   });
  } else {
    notification["error"]({
     message: 'EquiV',
     description: 'Failed to identify you, please try again.',
   });
  }
}

export default Login;
