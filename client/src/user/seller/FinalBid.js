import React, { Component } from 'react';
import { Layout, Table } from 'antd';
import './FinalBid.css';
import { dealerGetHighestBid, dealerViewListings } from '../../util/APIUtils';

class Seller_finalbid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listingId: "",
            highestBid: "",
            tableData: []
        }
        this.viewHighestBid = this.viewHighestBid.bind(this);
        this.loadAllListings = this.loadAllListings.bind(this);

    }

    loadAllListings() {
        dealerViewListings()
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

    componentDidMount() {
        this.loadAllListings();
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
          render: (text, record, index) => {
            this.viewHighestBid(index)
            return (
              <div>{this.state.highestBid}</div>
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

export default Seller_finalbid;
