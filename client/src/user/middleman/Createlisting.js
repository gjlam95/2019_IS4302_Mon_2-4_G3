import React, { Component } from 'react';
import { middlemanCreateListing } from '../../util/APIUtils';
import './Createlisting.css';
import { Form, Input, Button, notification } from 'antd';

const FormItem = Form.Item;

class Middleman_createlisting extends Component {
  constructor(props) {
        super(props);
        this.state = {
          vehicleId: '',
          listingId: '',
          listingExpiry: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : inputValue,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const listing = {
            vehicleId: this.state.vehicleId,
            listingId: this.state.listingId,
            listing_expiry: this.state.listingExpiry,
            listingStatus: "OPEN_FOR_BIDDING"
        };
        middlemanCreateListing(listing)
        .then(response => {
            notification.success({
                message: 'Equiv',
                description: "You've successfully created a new listing!",
            });
            this.props.history.push("/mylistings");
        }).catch(error => {
            notification.error({
                message: 'Equiv',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    render() {
        return (
            <div className="adduser-container">
                <h1 className="page-title">Create Listing</h1>
                <div className="adduser-content">
                    <Form onSubmit={this.handleSubmit} className="adduser-form">
                        <FormItem
                          label="Vehicle ID">
                          <Input
                              size="large"
                              name="vehicleId"
                              value={this.state.vehicleId}
                              onChange={(event) => {this.handleInputChange(event)}} />
                        </FormItem>
                        <FormItem
                            label="Listing ID">
                            <Input
                                size="large"
                                name="listingId"
                                autoComplete="off"
                                value={this.state.listingId}
                                onChange={(event) => {this.handleInputChange(event)}}  />
                        </FormItem>
                        <FormItem
                            label="Listing Expiry">
                            <Input
                                size="large"
                                name="listingExpiry"
                                autoComplete="off"
                                value={this.state.listingExpiry}
                                onChange={(event) => {this.handleInputChange(event)}} />
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="createlisting-form-button">Create Listing</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Middleman_createlisting;
