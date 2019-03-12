import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { getPatientProfile, createNote } from '../../util/APIUtils';
import { NOTE_CONTENT_MAX_LENGTH } from '../../constants';
import { Layout, Button, Input, Form, notification } from 'antd';
import './NewNote.css';

const FormItem = Form.Item;
const { Content } = Layout;
const { TextArea } = Input;

class Therapist_newnote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            patient: null,
            isLoading: false
        }

        this.loadPatientProfile = this.loadPatientProfile.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    loadPatientProfile(pat_nric) {
        this.setState({
            isLoading: true
        });

        getPatientProfile(pat_nric)
        .then(response => {
            this.setState({
                patient: response,
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
            patientNric: this.state.patient.nric,
            noteContent: this.state.content.value
        };
        createNote(noteRequest)
        .then(response => {
            notification.success({
                message: 'Healthcare App',
                description: `You've successfully created a new note for ${this.state.patient.nric}!`
            });
            const previousLink = `/mypatients/${this.state.patient.nric}`;
            this.props.history.push(previousLink);
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
        const match = matchPath(this.props.history.location.pathname, {
          path: '/mypatients/:nric/newnote',
          exact: true,
          strict: false
        });
        const pat_nric = match.params.nric;
        this.loadPatientProfile(pat_nric);
    }


    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.nric !== nextProps.match.params.nric) {
            this.loadPatientProfile(nextProps.match.params.nric);
        }
    }

    render() {

        return (
          <div className="patient-data">
            {  this.state.patient ? (
                <Layout className="layout">
                  <Content>
                    <div style={{ background: '#ECECEC' }}>
                      <div className="name">&nbsp;&nbsp;{this.state.patient.name}</div>
                      <div className="subtitle">&nbsp;&nbsp;&nbsp;&nbsp;NRIC: {this.state.patient.nric}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone Number: {this.state.patient.phone}</div>
                      <br />
                    </div>
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

export default Therapist_newnote;
