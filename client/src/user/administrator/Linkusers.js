import React, { Component } from 'react';
import { assign, unassign } from '../../util/APIUtils';
import { Form, Input, Button, notification } from 'antd';
import './Linkusers.css';

const FormItem = Form.Item;

class Administrator_link_users extends Component {
  constructor(props) {
        super(props);
        this.state = {
          therapist1: '',
          patient1: '',
          therapist2: '',
          patient2: '',
          endDate: ''
        }
        this.handleAssign = this.handleAssign.bind(this);
        this.handleUnassign = this.handleUnassign.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

  handleAssign(event) {
      event.preventDefault();
      const linkuserRequest = {
          therapistNric: encodeURIComponent(this.state.therapist1.value),
          patientNric: encodeURIComponent(this.state.patient1.value),
          endDate: encodeURIComponent(this.state.endDate.value)
      };
      assign(linkuserRequest)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully assigned the users!",
          });
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
  }

  handleUnassign(event) {
      event.preventDefault();
      const delinkuserRequest = {
          therapistNric: this.state.therapist2.value,
          patientNric: this.state.patient2.value
      };
      unassign(delinkuserRequest)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully unassigned the users!",
          });
          this.props.history.push("/link");
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
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

  render() {
      return (
          <div className="linkuser-container">
              <h1 className="page-title">Therapist -> Patient(s)</h1>
              <div className="linkuser-content">
                  <Form onSubmit={this.handleAssign} className="linkuser-form">
                      <FormItem
                          label="Therapist NRIC">
                          <Input
                              size="large"
                              name="therapist1"
                              value={this.state.therapist1.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="Patient NRIC">
                          <Input
                              size="large"
                              name="patient1"
                              value={this.state.patient1.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="End Date">
                          <Input
                              size="large"
                              name="endDate"
                              value={this.state.endDate.value}
                              placeholder="YYYY-MM-DD"
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem>
                          <Button type="primary" icon="shrink"
                              htmlType="submit"
                              size="large"
                              className="linkuser-form-button"
                              >Assign</Button>
                      </FormItem>
                  </Form>
              </div>
              <h1 className="page-title">Therapist -/> Patient(s)</h1>
              <div className="linkuser-content">
                  <Form onSubmit={this.handleUnassign} className="linkuser-form">
                      <FormItem
                          label="Therapist NRIC">
                          <Input
                              size="large"
                              name="therapist2"
                              value={this.state.therapist2.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="Patient NRIC">
                          <Input
                              size="large"
                              name="patient2"
                              value={this.state.patient2.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem>
                          <Button type="primary" icon="arrow-alt"
                              htmlType="submit"
                              size="large"
                              className="linkuser-form-button"
                              >Unassign</Button>
                      </FormItem>
                  </Form>
              </div>
          </div>
      );
  }
}

export default Administrator_link_users;
