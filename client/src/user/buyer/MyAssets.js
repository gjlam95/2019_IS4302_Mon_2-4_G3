import React, { Component } from 'react';
import update from 'immutability-helper';
import findIndex from 'lodash.findindex';
import { Layout, Table } from 'antd';
import { getSellers, getSellerProfile } from '../../util/APIUtils';
import './MyAssets.css';

const { Header, Content } = Layout;

class Buyer_mysellers extends Component {
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
          title: 'ID',
          dataIndex: 'car',
          key: 'car',
          align: 'center',
        },  {
          title: 'Mileage',
          dataIndex: 'name',
          align: 'center',
        },  {
          title: 'COE',
          dataIndex: 'phone',
          align: 'center',
        },  {
          title: 'Warranty',
          dataIndex: 'docs_recs',
          align: 'center',
        },  {
          title: 'Road Tax',
          dataIndex: 'docs_recs',
          align: 'center',
        },  {
          title: 'Features',
          dataIndex: 'docs_recs',
          align: 'center',
        }];


        return (
              <Layout className="layout">
                <Header>
                  <div className="title">My Assets</div>
                </Header>
                <Content>
                  <Table dataSource={this.state.sellers} columns={columns} rowKey="nric" />
                </Content>
              </Layout>
        );
    }
}

export default Buyer_mysellers;
