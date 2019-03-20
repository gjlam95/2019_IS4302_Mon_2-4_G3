import React, { Component } from 'react';
import update from 'immutability-helper';
import findIndex from 'lodash.findindex';
import { Layout, Table } from 'antd';
import { getSellers, getSellerProfile } from '../../util/APIUtils';
import './Mylistings.css';

const { Header, Content } = Layout;

class Dealer_mylistings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sellers: [],
            isLoading: false
        }

        this.loadSellers = this.loadSellers.bind(this);
    }

    loadSellers() {
        this.setState({
            isLoading: true
        });

        getSellers()
        .then(response => {
                const patdata = [];

                for (var i = 0; i < response.content.length; i++) {
                    var currentnric = response.content[i].treatmentId.seller;

                    patdata[i] = ({ key: i,
                                    nric: currentnric
                                  });
                }

                this.setState({ sellers: patdata });

                for (var j = 0; j < response.content.length; j++) {

                    var currnric = response.content[j].treatmentId.seller;

                    getSellerProfile(currnric)
                    .then((result) => { var i = findIndex(this.state.sellers, ['nric', result.nric]);
                                        this.setState({ sellers: update(this.state.sellers, {[i]: { name: {$set: result.name},
                                                                                                      phone: {$set: result.phone} }}) });
                                      }
                    ).catch(error => {
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
              }
        )
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
        this.loadSellers();
    }

    render() {

        const columns = [{
          title: 'Listing ID',
          dataIndex: 'nric',
          key: 'nric',
          align: 'center',
        },  {
          title: 'Information',
          dataIndex: 'name',
          align: 'center',
        },  {
          title: 'Features',
          dataIndex: 'phone',
          align: 'center',
        },  {
          title: 'Edit',
          dataIndex: 'docs_recs',
          align: 'center',
          render: (text, row) => <a href={ "/mysellers/" + row.nric }>View, Edit or Create</a>,
        }];


        return (
              <Layout className="layout">
                <Header>
                  <div className="title">Listings</div>
                </Header>
                <Content>
                  <Table dataSource={this.state.sellers} columns={columns} rowKey="nric" />
                </Content>
              </Layout>
        );
    }
}

export default Dealer_mylistings;
