/* eslint-disable */
import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { updateNote, getMyNotes } from '../../util/APIUtils';
import { NOTE_CONTENT_MAX_LENGTH } from '../../constants';
import { Layout, Button, Input, Form, notification } from 'antd';
import './EditNote.css';

const FormItem = Form.Item;
const { Content } = Layout;
const { TextArea } = Input;

class Patient_editnote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            noteid: '',
            contentobtained: false,
            isLoading: false
        }

        this.loadNoteContent = this.loadNoteContent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }



    loadNoteContent(note_id) {
      this.setState({
          noteid: note_id,
          isLoading: true
      });

      getMyNotes()
      .then((response) => {
          for (var i = 0; i < response.content.length; i++) {
              var currentid = response.content[i].noteID;
              if (currentid == this.state.noteid) {
                this.setState({
                    content: { value: response.content[i].noteContent },
                    contentobtained: true,
                    isLoading: false
                });
                break;
              }
          }

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
        const updateRequest = {
            noteID: this.state.noteid,
            noteContent: this.state.content.value
        };
        updateNote(updateRequest)
        .then(response => {
            notification.success({
                message: 'Healthcare App',
                description: `You've successfully edited your note!`
            });

            this.props.history.push("/mydata");
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
          path: '/mydata/editnote/:id',
          exact: true,
          strict: false
        });

        const note_id = match.params.id;
        this.loadNoteContent(note_id);
    }


    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.id !== nextProps.match.params.id) {
            this.loadNoteContent(nextProps.match.params.id);
        }
    }

    render() {

        return (
          <div className="patient-data">
            {  (this.state.contentobtained) ? (
                <Layout className="layout">
                  <Content>
                    <div className="title">
                      Edit Note { this.state.noteid } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div className="editnote-container">
                      <Form onSubmit={this.handleSubmit} className="editnote-form">
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
                                  className="editnote-form-button"
                                  disabled={this.isFormInvalid()}>Edit note</Button>
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

export default Patient_editnote;
