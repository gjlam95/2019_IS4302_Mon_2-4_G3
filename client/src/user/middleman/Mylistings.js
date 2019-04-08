import React, { Component } from 'react';
import { Form, Input, Button, Layout, Table, notification } from 'antd';
import './Mylistings.css';
import { middlemanViewListings, middlemanCloseListing, middlemanDeleteListing, middlemanUpdateListingExpiry, dealerGetHighestBid, dealerViewListings } from '../../util/APIUtils';

const FormItem = Form.Item;

class Middleman_mylistings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listingId: "",
            date: "",
            tableData: []
        }
        this.updateListingExpiry = this.updateListingExpiry.bind(this);
        this.deleteListing = this.deleteListing.bind(this);
        this.closeListing = this.closeListing.bind(this);
        this.viewHighestBid = this.viewHighestBid.bind(this);
        this.loadAllListings = this.loadAllListings.bind(this);

    }

    /*
    Active listings by middleman
    */
    loadAllListings() {
        middlemanViewListings()
        .then(data => {
          this.setState({
            tableData: data
          })
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

    componentDidMount() {
        this.loadAllListings();
    }

    updateListingExpiry(event) {
      event.preventDefault()
      const expiry = {
        listingToUpdate: this.state.listingId,
        newListing_expiry: this.state.date,
      };
      middlemanUpdateListingExpiry(expiry)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully updated the expiry date!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    deleteListing(event) {
      event.preventDefault()
      const id = {
        listingToDelete: this.state.listingId,
      };
      middlemanDeleteListing(id)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully deleted the listing!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    closeListing(event) {
      event.preventDefault()
      const id = {
        listing: this.state.listingId,
      };
      middlemanCloseListing(id)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully closed the listing!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    viewHighestBid(index) {
      dealerViewListings()
      .then(data => {
        dealerGetHighestBid(data[index].highestBid.split('#')[1])
        .then(response => {
          this.setState({
            highestBid: response.bidAmount
          })
        })
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

    render() {
        const { Content } = Layout;
        const users_columns = [{
          title: 'Listing',
          dataIndex: 'listingId',
        }, {
          title: 'Status',
          dataIndex: 'listingStatus',
        }, {
          title: 'Listing Expiry',
          dataIndex: 'listing_expiry'
        }, {
          title: 'Highest Offer',
          render: (text, record, index) => {
            this.viewHighestBid(index)
            return (
              <div>{this.state.highestBid}</div>
            )
          }
        }, {
          title: 'Update Listing Expiry',
          render: (text) => {
            return (
              <Form onSubmit={this.updateListingExpiry} className="update-listing">
                <FormItem>
                  <Input
                  size="small"
                  value={this.state.date}
                  onChange={event => {
                    this.setState({listingId: text.listingId})
                    this.setState({date: event.target.value});
                  }}/>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="update-listing-form-button"
                  >
                  Update Listing
                  </Button>
                </FormItem>
              </Form>
            )
          }
        }, {
          title: 'Close Listing',
          render: (text) => {
            return (
              <Form onSubmit={this.closeListing} className="close-listing">
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="close-listing-form-button"
                    onClick={event => {
                      this.setState({listingId: text.listingId})
                    }}
                  >
                  Close Listing
                  </Button>
                </FormItem>
              </Form>
            )
          }
        }, {
          title: 'Delete Listing',
          render: (text) => {
            return (
              <Form onSubmit={this.deleteListing} className="delete-listing">
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="delete-listing-form-button"
                    onClick={event => {
                      this.setState({listingId: text.listingId})
                    }}
                  >
                  Delete Listing
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
                    My Listings
                  </div>
                  <Table dataSource={this.state.tableData} columns={users_columns}/>
                </Content>
              </Layout>
        );
    }
}

export default Middleman_mylistings;
