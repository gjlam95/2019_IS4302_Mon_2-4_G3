import React, { Component } from 'react';
import { createNote, getCurrentUser } from '../../util/APIUtils';
import { NOTE_CONTENT_MAX_LENGTH } from '../../constants';
import { Layout, Button, Input, Form, notification } from 'antd';
import './NewNote.css';

const FormItem = Form.Item;
const { Content } = Layout;
const { TextArea } = Input;

class Patient_newnote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            currentUser: null,
            isLoading: false
        }

        this.getCurrentPatient = this.getCurrentPatient.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    getCurrentPatient() {
        this.setState({
            isLoading: true
        });

        getCurrentUser()
        .then((response) => {
            this.setState({
                currentUser: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
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
        const noteRequest = {
            patientNric: this.state.currentUser.nric,
            noteContent: this.state.content.value
        };
        createNote(noteRequest)
        .then(response => {
            notification.success({
                message: 'Healthcare App',
                description: `You've successfully created a new note!`
            });
            this.props.history.push('/mydata');
        }).catch(error => {
            notification.error({
                message: 'Healthcare App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.content.validateStatus === 'success'
        );
    }

    validateContent = (content) => {
        if (!content) {
            return {
                validateStatus: 'error',
                errorMsg: 'Content must not be empty'
            };
        } else if (content.trim() === "") {
            return {
                validateStatus: 'error',
                errorMsg: 'Content must not be blank'
            };
        } else if (content.length > NOTE_CONTENT_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Content is too long (Only ${NOTE_CONTENT_MAX_LENGTH} characters allowed.)`
            };
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            };
        }
    }

    componentDidMount() {
        this.getCurrentPatient();
    }

    render() {

        return (
          <div className="patient-data">
            {  this.state.currentUser ? (
                <Layout className="layout">
                  <Content>
                    <div className="title">
                      New Note &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="newnote-container">
                      <Form onSubmit={this.handleSubmit} className="newnote-form">
                          <FormItem
                              label="Content"
                              hasFeedback
                              validateStatus={this.state.content.validateStatus}
                              help={this.state.content.errorMsg}>
                              <TextArea
                                  rows={4}
                                  name="content"
                                  autoComplete="off"
                                  value={this.state.content.value}
                                  onChange={(event) => {this.handleInputChange(event, this.validateContent)}} />
                          </FormItem>
                          <FormItem>
                              <Button type="primary"
                                  htmlType="submit"
                                  size="large"
                                  className="newnote-form-button"
                                  disabled={this.isFormInvalid()}>Add note</Button>
                          </FormItem>
                      </Form>
                    </div>
                  </Content>
                </Layout>
              ): null
            }
          </div>
        );
    }
}

export default Patient_newnote;
