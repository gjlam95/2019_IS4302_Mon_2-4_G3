import React, { Component } from 'react';
import { Form, Input, Layout, Upload, Button, Icon, Select, notification, Spin  } from 'antd';
import { matchPath } from 'react-router';
import { getSellerProfile, createRecord } from '../../util/APIUtils';
import './UploadRecord.css';

const FormItem = Form.Item;
const { Content } = Layout;
const Option = Select.Option;
const firstData = ['illness', 'reading'];
const secondData = {
  illness: ['allergy', 'asthma', 'back pain', 'bronchitis', 'cancer', 'cataracts', 'caries', 'chickenpox', 'cold', 'depression',
  'eating disorders', 'gingivitis', 'gout', 'haemorrhoids', 'headches and migraines', 'heart disease', 'high blood cholestrol', 'hypertension',
'panic attack', 'obsessive compulsive disorder', 'schizophrenia', 'stroke', 'urinary'],
  reading: ['blood pressure'],
};

class Buyer_uploadrecord extends Component {
  constructor(props) {
        super(props);
        this.state = {
          type: {
            value: null
          },
          subtype: {
            value: null
          },
          title: {
            value: null
          },
          sellerIC: {
            value: null
          },
          selectedFileList: [],
          data: {
            startData: secondData[firstData[0]],
            nextData: secondData[firstData[0]][0],
          },
          seller: null,
          isLoading: false,
        }
        this.handleFirstDataChange = this.handleFirstDataChange.bind(this);
        this.onSecondDataChange = this.onSecondDataChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.verifyFieldsFilled = this.verifyFieldsFilled.bind(this);
        this.loadSellerProfile = this.loadSellerProfile.bind(this);
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

    verifyFieldsFilled() {
      return (this.state.type.value===null || this.state.title.value===null ||
              this.state.sellerIC.value===null || this.state.selectedFileList.length===0);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue
            }
        });
    }

    handleFirstDataChange = (value) => {
    this.setState({
      type: {
        value: value
      },
      data: {
        startData: secondData[value],
        nextData: secondData[value][0],
      },
      subtype: {
        value: secondData[value][0]
      }
    });
  }

  onSecondDataChange = (value) => {
    this.setState({
      subtype: {
        value: value
      },
      data: {
        startData: this.state.data.startData,
        nextData: value,
      }
    });
  }

    handleSubmit(event) {
        event.preventDefault();
        const createRecordRequest = {
            type: this.state.type.value,
            subtype: this.state.subtype.value,
            title: this.state.title.value,
            sellerIC: this.state.sellerIC.value
        };
        const uploadedFile = this.state.selectedFileList[0]
        createRecord(createRecordRequest, uploadedFile)
        .then(response => {
            notification.success({
                message: 'EquiV',
                description: "Record created!",
            });
            this.props.history.push("/mysellers/" + this.state.sellerIC.value);
        }).catch(error => {
            notification.error({
                message: 'EquiV',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    beforeUpload = (file) => {
      this.setState({
          selectedFileList: [file],
        });
      return false;
    };

    componentDidMount() {
        const match = matchPath(this.props.history.location.pathname, {
          path: '/mysellers/:nric/uploadrecord',
          exact: true,
          strict: false
        });
        const pat_nric = match.params.nric;
        this.setState({
            sellerIC: {
              value: pat_nric
            }
        });
        this.loadSellerProfile(pat_nric);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.nric !== nextProps.match.params.nric) {
            this.setState({
                sellerIC: {
                  value: nextProps.match.params.nric
                }
            });
            this.loadSellerProfile(nextProps.match.params.nric);
        }
    }


    render() {
        return (
          <div className="upload-data">
            {  this.state.seller ? (
                <Layout className="layout">
                  <Content>
                    <div style={{ background: '#ECECEC' }}>
                      <div className="name">&nbsp;&nbsp;{this.state.seller.name}</div>
                      <div className="subtitle">&nbsp;&nbsp;&nbsp;&nbsp;NRIC: {this.state.seller.nric}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone Number: {this.state.seller.phone}</div>
                      <br />
                    </div>
                    <div className="createRecord-container">
                        <h1 className="page-title">Create New Record</h1>
                        <div className="createRecord-content">
                        <Spin spinning={this.state.isLoading}>
                            <Form onSubmit={this.handleSubmit} className="createRecord-form">
                                <FormItem
                                  label="Type">
                                  <Select
                                      size="large"
                                      required="true"
                                      name="type"
                                      onChange={this.handleFirstDataChange}>
                                      {firstData.map(first => <Option key={first}>{first}</Option>)}
                                  </Select>
                                </FormItem>
                                <FormItem
                                    label="Subtype">
                                    <Select
                                        size="large"
                                        name="subtype"
                                        value={this.state.data.nextData}
                                        onChange={this.onSecondDataChange}>
                                        {this.state.data.startData.map(second => <Option key={second}>{second}</Option>)}
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label="Title">
                                    <Input
                                        size="large"
                                        name="title"
                                        autoComplete="off"
                                        value={this.state.title.value}
                                        onChange={(event) => {this.handleInputChange(event)}} />
                                </FormItem>
                                <FormItem
                                    label="Document">
                                    <Upload beforeUpload={this.beforeUpload} fileList={this.state.selectedFileList}>
                                      <Button>
                                        <Icon type="upload" /> Upload
                                      </Button>
                                    </Upload>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="createRecord-form-button"
                                        disabled={this.verifyFieldsFilled()}
                                        >Create Record</Button>
                                    <Button type="primary"
                                        size="large"
                                        className="createRecord-form-button"
                                        onClick={this.startConnection.bind(this)}
                                        disabled={this.verifyFieldsFilled()}
                                        >Connect Seller Tag To Create Record</Button>
                                </FormItem>
                            </Form>
                          </Spin>
                        </div>
                    </div>
                  </Content>
                </Layout>
              ): null
            }
          </div>
        );
    }
  }

export default Buyer_uploadrecord;
