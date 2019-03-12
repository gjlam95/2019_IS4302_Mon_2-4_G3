import React, { Component } from 'react';
import { Layout, Upload, Button, Icon, Select, Form } from 'antd';
import { API, AUTH_TOKEN } from '../../constants/index.js';
import './Uploaddatabase.css';

const FormItem = Form.Item;
const Option = Select.Option;

class External_upload_database extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filelist: [],
      type: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange = (response) => {
    document.getElementById('contents').innerHTML = response.file.name;
  }

  render() {
    const { Header, Content } = Layout;
    const props = {
      action: API + "/external/upload/" + this.state.type.value,
      headers: {
        SessionId: localStorage.getItem(AUTH_TOKEN),
        enctype: "multipart/form-data"
      },
      onChange: this.handleChange,
      withCredentials: "include",
    };
    return (
      <Layout className="layout">
      <Header>
      <div className="title">Upload Database</div>
      </Header>
      <Content>
          <Form className="adduser-form">
              <FormItem
                  label="Type">
                  <Select onSubmit={this.handleSubmit} placeholder="Select the relevant type"
                      name="type"
                      autoComplete="off"
                      onChange={(value) => this.setState({
                          type : {
                              value: value
                          }})}>
                      <Option value="users">Users</Option>
                      <Option value="records">Records</Option>
                  </Select>
              </FormItem>
          </Form>
          <Upload {...props} onChange={this.onChange} fileList={this.state.selectedFileList}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
          <div id="contents"></div>
          <div id="log"></div>
      </Content>
      </Layout>
    );
  }
}

export default External_upload_database;
