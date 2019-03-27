import React, { Component } from 'react';
import { buyerMakePayment } from '../../util/APIUtils';
import { Form, Input, Button, notification } from 'antd';
import './Makepayment.css';

const FormItem = Form.Item;

class Dealer_makepayment extends Component {
  constructor(props) {
        super(props);
        this.state = {
          listing: '',
          payer: '',
          payee: '',
        }
        this.handleMakePayment = this.handleMakePayment.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

  handleMakePayment(event) {
      event.preventDefault();
      const makePayment = {
          listing: encodeURIComponent(this.state.listing.value),
          payer: encodeURIComponent(this.state.payer.value),
          payee: encodeURIComponent(this.state.payee.value),
      };
      buyerMakePayment(makePayment)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully made a payment!",
          });
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
          <div className="payuser-container">
              <h1 className="page-title">Make Payment</h1>
              <div className="payuser-content">
                  <Form onSubmit={this.handleMakePayment} className="payuser-form">
                      <FormItem
                      label="Listing">
                      <Input
                          size="large"
                          name="listing"
                          value={this.state.listing.value}
                          onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="Your NRIC">
                          <Input
                              size="large"
                              name="payer"
                              value={this.state.payer.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="Recipient's NRIC">
                          <Input
                              size="large"
                              name="payee"
                              value={this.state.payee.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem>
                          <Button type="primary" icon="shrink"
                              htmlType="submit"
                              size="large"
                              className="payuser-form-button"
                              >Pay</Button>
                      </FormItem>
                  </Form>
              </div>
          </div>
      );
  }
}

export default Dealer_makepayment;