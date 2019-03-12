import React, { Component } from 'react';
import { Form, Select, Button, Layout, Table, notification} from 'antd';
import './Generatedata.css';
import { getAnonymousData } from '../../util/APIUtils';

const FormItem = Form.Item;
const Option = Select.Option;
const firstData = ['illness', 'reading'];
const secondData = {
  illness: ['all', 'allergy', 'asthma', 'back pain', 'bronchitis', 'cancer', 'cataracts', 'caries', 'chickenpox', 'cold', 'depression',
  'eating disorders', 'gingivitis', 'gout', 'haemorrhoids', 'headches and migraines', 'heart disease', 'high blood cholestrol', 'hypertension',
'panic attack', 'obsessive compulsive disorder', 'schizophrenia', 'stroke', 'urinary'],
  reading: ['blood pressure'],
};

class GenerateButton extends Component {
  render() {
    return (
      <div>
        <Button type="primary" htmlType="submit" icon="file-text" size="default">Generate</Button>
      </div>
    );
  }
}

class GenerateDataForm extends Component {
  state = {
    data: secondData[firstData[0]],
    nextData: secondData[firstData[0]][0],
    tableData: ''
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      getAnonymousData(values)
      .then(response => {
        this.setState({tableData: response})
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    });
  }

  handleFirstDataChange = (value) => {
    this.setState({
      data: secondData[value],
      nextData: secondData[value][0],
    });
  }

  onSecondDataChange = (value) => {
    this.setState({
      nextData: value,
    });
  }

  render() {
      const { Header, Content } = Layout;
      const { getFieldDecorator } = this.props.form
      const { data } = this.state;
      const columns = [{
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      }, {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      }, {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      }];

      return (
            <Layout className="layout">
              <Header>
                <div className="title">Research Data</div>
              </Header>
              <Content>
              <Table dataSource={this.state.tableData} columns={columns} />
              <br /><br />
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                    label="Age"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('age', {
                      rules: [{ required: true, message: 'Please select an age group!' }],
                    })(
                      <Select
                        placeholder="Select an option"
                      >
                        <Option value="all">all</Option>
                        <Option value="below 13">below 13</Option>
                        <Option value="from 13 to 18">from 13 to 18</Option>
                        <Option value="from 19 to 25">from 19 to 25</Option>
                        <Option value="from 26 to 35">from 26 to 35</Option>
                        <Option value="from 36 to 55">from 36 to 55</Option>
                        <Option value="above 55">above 55</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="Gender"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('gender', {
                      rules: [{ required: true, message: 'Please select a gender!' }],
                    })(
                      <Select
                        placeholder="Select an option"
                      >
                        <Option value="all">all</Option>
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="Location"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('location', {
                      rules: [{ required: true, message: 'Please select a location!' }],
                    })(
                      <Select
                        placeholder="Select an option"
                      >
                        <Option value="all">all</Option>
                        <Option value="central">central</Option>
                        <Option value="east">east</Option>
                        <Option value="north">north</Option>
                        <Option value="north-east">north-east</Option>
                        <Option value="north-west">north-west</Option>
                        <Option value="south">south</Option>
                        <Option value="south-west">south-west</Option>
                        <Option value="west">west</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="Type"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: 'Please select a type of health data!' }],
                    })(
                      <Select
                        placeholder="Select an option"
                        onChange={this.handleFirstDataChange}
                      >
                      {firstData.map(first => <Option key={first}>{first}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="Subtype"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('subtype', {
                      rules: [{ required: true, message: 'Please select a type of health data!' }],
                    })(
                      <Select
                        placeholder="Select an option"
                        value={this.state.nextData}
                        onChange={this.onSecondDataChange}
                      >
                      {data.map(second => <Option key={second}>{second}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    wrapperCol={{ span: 8, offset: 4 }}
                  >
                    <GenerateButton />
                  </FormItem>
                </Form>
              </Content>
            </Layout>
      );
  }
}

class Researcher_generate_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.currentUser,
            isLoading: false
        }
    }

    render() {
      const WrappedForm = Form.create()(GenerateDataForm);

      return <WrappedForm />;
    }
}

export default Researcher_generate_data;
