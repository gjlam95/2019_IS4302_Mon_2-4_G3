import React, { Component } from "react";
import { Form, Input, Button, Layout, Table, notification } from "antd";
import { dealerViewListings, dealerIncludeOffers } from "../../util/APIUtils";
import "./Mylistings.css";

const FormItem = Form.Item;

class Dealer_mylistings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingId: "",
      description: "",
      tableData: [],
      sellingPrice: ""
    };
    this.includeOffers = this.includeOffers.bind(this);
    this.loadAllListings = this.loadAllListings.bind(this);
  }

  /*
  Listings to show to potential buyers
  */
  loadAllListings() {
    dealerViewListings()
      .then(data => {
        this.setState({ tableData: data });
      })
      .catch(error => {
        if (error.status === 404) {
          this.setState({
            notFound: true
          });
        } else {
          this.setState({
            serverError: true
          });
        }
      });
  }

  /*
  Include price and additional offers by dealers
  */
  includeOffers(event) {
    event.preventDefault();
    const offers = {
      dealerListing: this.state.listingId,
      dealerOffers: this.state.description,
      dealerSellingPrice: this.state.sellingPrice
    };
    dealerIncludeOffers(offers)
      .then(response => {
        notification.success({
          message: "EquiV",
          description: "You've successfully entered your details!"
        });
        window.location.reload();
      })
      .catch(error => {
        notification.error({
          message: "EquiV",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      });
  }

  componentDidMount() {
    this.loadAllListings();
  }

  render() {
    const { Content } = Layout;

    const users_columns = [
      {
        title: "Listing",
        dataIndex: "listingId"
      },
      {
        title: "Dealer Offers",
        dataIndex: "dealerOffers"
      },
      {
        title: "Dealer Selling Price",
        dataIndex: "dealerSellingPrice"
      },
      {
        title: "Edit",
        render: text => {
          return (
            <Form onSubmit={this.includeOffers} className="dealer-offers">
              <FormItem>
                <Input
                  size="small"
                  placeholder="Offer"
                  value={this.state.description}
                  onChange={event => {
                    this.setState({ listingId: text.listingId });
                    this.setState({ description: event.target.value });
                  }}
                />
              </FormItem>
              <FormItem>
                <Input
                  size="small"
                  placeholder="Selling Price"
                  value={this.state.sellingPrice}
                  onChange={event => {
                    this.setState({ sellingPrice: event.target.value });
                  }}
                />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="dealer-offers-form-button"
                >
                  Submit
                </Button>
              </FormItem>
            </Form>
          );
        }
      }
    ];

    return (
      <Layout className="userlayout">
        <Content>
          <div className="usertitle">Listings</div>
          <Table dataSource={this.state.tableData} columns={users_columns} />
        </Content>
      </Layout>
    );
  }
}

export default Dealer_mylistings;
