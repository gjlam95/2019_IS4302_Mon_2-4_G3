import React, { Component } from 'react';
import { Form, Input, Button, Layout, Table, notification } from 'antd';
import './Viewlistings.css';
import { dealerSubmitBid, dealerUpdateBid, dealerViewListings } from '../../util/APIUtils';

const FormItem = Form.Item;

class Dealer_viewlistings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listingId: "",
            initialBid: "",
            updatedBid: "",
            tableData: []
        }
        this.submitBid = this.submitBid.bind(this);
        this.updateBid = this.updateBid.bind(this);
        this.viewListings = this.viewListings.bind(this);
        this.loadAllListings = this.loadAllListings.bind(this);
    }

    loadAllListings() {
        dealerViewListings()
        .then(data => {
          this.setState({ tableData: data })
        })
        .catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                });
            } else {
                this.setState({
                    serverError: true,
                });
            }
        });
    }

    viewListings() {
      fetch("dealer/api/org.equiv.participants.assets.Listing")
      .then(data => {
        console.log("View Open Listings");
        console.log(data)
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    submitBid(event) {
      event.preventDefault()
      const intialBidAmt = {
        listingId: this.state.listingId,
        bidAmount: Number(this.state.initialBid),
      };
      dealerSubmitBid(intialBidAmt)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully entered your bid!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    updateBid(event) {
      event.preventDefault()
      const updatedBidAmt = {
        bid: this.state.listingId,
        newBidAmount: Number(this.state.updatedBid),
      };
      dealerUpdateBid(updatedBidAmt)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully updated your bid!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    componentDidMount() {
        this.loadAllListings();
        this.viewListings();
    }

    render() {
        const { Content } = Layout;

        const users_columns = [{
          title: 'Listing',
          dataIndex: 'listingId',
        }, {
          title: 'Status',
          dataIndex: 'listingStatus',
        }, {
          title: 'Highest Offer',
          dataIndex: 'bids[0].bidAmount',
        }, {
          title: 'Initial Bid',
          render: (text) => {
            return (
              <Form onSubmit={this.updateBid} className="initial-bid-form">
                <FormItem>
                  <Input
                  size="small"
                  value={this.state.initialBid}
                  onChange={event => {
                    this.setState({listingId: text.listingId})
                    this.setState({initialBid: event.target.value});
                  }}/>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="initial-bid-form-button"
                  >
                  Bid
                  </Button>
                </FormItem>
              </Form>
            )
          }
        }, {
          title: 'Update Bid',
          render: (text) => {
            return (
              <Form onSubmit={this.updateBid} className="updated-bid-form">
                <FormItem>
                  <Input
                  size="small"
                  value={this.state.updatedBid}
                  onChange={event => {
                    this.setState({listingId: text.bids[0].bidId})
                    this.setState({updatedBid: event.target.value});
                  }}/>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="updated-bid-form-button"
                  >
                  Bid
                  </Button>
                </FormItem>
              </Form>
            )
          }
        }];

        return (
              <Layout className="userlayout">
                <Content>
                  <div className="usertitle">
                    Bids
                  </div>
                  <Table dataSource={this.state.tableData} columns={users_columns}/>
                </Content>
              </Layout>
        );
    }
}

export default Dealer_viewlistings;
