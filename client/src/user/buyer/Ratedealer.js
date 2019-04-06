import React, { Component } from 'react';
import { buyerRateDealer, buyerUpdateRatings } from '../../util/APIUtils';
import { Form, Input, Button, notification } from 'antd';
import './Ratedealer.css';

const FormItem = Form.Item;

class RateDealer extends Component {
  constructor(props) {
        super(props);
        this.state = {
          dealerIC: '',
          rating: '',
        }
        this.handleRateDealer = this.handleRateDealer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

  handleRateDealer(event) {
      event.preventDefault();
      const dealerRating = {
          dealer: this.state.dealerIC.value,
          rating: Number(this.state.rating.value)
      };
      const updateRating = {
        dealer: this.state.dealerIC.value
      }
      buyerRateDealer(dealerRating)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully rated a dealer!",
          });
          buyerUpdateRatings(updateRating)
          window.location.reload()
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
              <h1 className="page-title">Rate Dealer</h1>
              <div className="payuser-content">
                  <Form onSubmit={this.handleRateDealer} className="ratedealer-form">
                      <FormItem
                          label="Dealer's NRIC">
                          <Input
                              size="large"
                              name="dealerIC"
                              value={this.state.dealerIC.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem
                          label="Rating">
                          <Input
                              size="large"
                              name="rating"
                              value={this.state.rating.value}
                              onChange={(event) => {this.handleInputChange(event)}} />
                      </FormItem>
                      <FormItem>
                          <Button type="primary" icon="shrink"
                              htmlType="submit"
                              size="large"
                              className="payuser-form-button"
                              >Rate</Button>
                      </FormItem>
                  </Form>
              </div>
          </div>
      );
  }
}

export default RateDealer;
