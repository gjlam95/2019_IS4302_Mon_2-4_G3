/* eslint-disable */
import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { getSellerProfile, getCurrentUser, updateNote, getAllBuyerNotes } from '../../util/APIUtils';
import { NOTE_CONTENT_MAX_LENGTH } from '../../constants';
import { Layout, Button, Input, Form, notification } from 'antd';
import './EditNote.css';

const FormItem = Form.Item;
const { Content } = Layout;
const { TextArea } = Input;

class Buyer_editnote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            noteid: '',
            seller: null,
            currentUser: null,
            isLoading: false
        }
        this.getCurrentBuyer = this.getCurrentBuyer.bind(this);
        this.loadSellerProfile = this.loadSellerProfile.bind(this);
        this.loadNoteContent = this.loadNoteContent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    getCurrentBuyer() {
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

    loadSellerProfile(pat_nric) {
        this.setState({
            isLoading: true
        });

        getSellerProfile(pat_nric)
        .then(response => {
            this.setState({
                seller: response,
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

    loadNoteContent(pat_nric, note_id) {
      this.setState({
          noteid: note_id,
          isLoading: true
      });

      getAllBuyerNotes(pat_nric)
      .then((response) => {

          for (var i = 0; i < response.content.length; i++) {
              var currentid = response.content[i].noteID;
              var currentcreator = response.content[i].creatorNric;
              if ((currentid == this.state.noteid) && (currentcreator == this.state.currentUser.nric)) {
                this.setState({
                    content: { value: response.content[i].noteContent },
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
                message: 'EquiV',
                description: `You've successfully edited a note for ${this.state.seller.nric}!`
            });
            const previousLink = `/mysellers/${this.state.seller.nric}`;
            this.props.history.push(previousLink);
        }).catch(error => {
            notification.error({
                message: 'EquiV',
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
          path: '/mysellers/:nric/editnote/:id',
          exact: true,
          strict: false
        });

        const pat_nric = match.params.nric;
        const note_id = match.params.id;
        this.getCurrentBuyer();
        this.loadSellerProfile(pat_nric);
        this.loadNoteContent(pat_nric, note_id);
    }


    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.nric !== nextProps.match.params.nric ||
           this.props.match.params.id !== nextProps.match.params.id) {
            this.getCurrentBuyer();
            this.loadSellerProfile(nextProps.match.params.nric);
            this.loadNoteContent(nextProps.match.params.nric, nextProps.match.params.id);
        }
    }

    render() {

        return (
          <div className="seller-data">
            {  this.state.seller ? (
                <Layout className="layout">
                  <Content>
                    <div style={{ background: '#ECECEC' }}>
                      <div className="name">&nbsp;&nbsp;{this.state.seller.name}</div>
                      <div className="subtitle">&nbsp;&nbsp;&nbsp;&nbsp;NRIC: {this.state.seller.nric}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone Number: {this.state.seller.phone}</div>
                      <br />
                    </div>
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

export default Buyer_editnote;
