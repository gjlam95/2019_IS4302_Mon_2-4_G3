import React, { Component } from 'react';
import { Layout, Table } from 'antd';
import { buyerGetAssets } from '../../util/APIUtils';
import './MyAssets.css';

const { Header, Content } = Layout;

class Buyer_myassets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.loadAssets = this.loadAssets.bind(this);
    }

    loadAssets() {
        buyerGetAssets()
        .then(data =>
          this.setState({data})
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
        this.loadAssets();
    }

    render() {

        const columns = [{
          title: 'Vehicle ID',
          dataIndex: 'vehicleId',
          align: 'center',
        }, {
          title: 'Mileage',
          dataIndex: 'vehicleDetails.mileage',
          align: 'center',
        }, {
          title: 'Features',
          dataIndex: 'vehicleDetails.features',
          align: 'center',
        }, {
          title: 'Description',
          dataIndex: 'vehicleDetails.description',
          align: 'center',
        }, {
          title: 'COE Expiry',
          dataIndex: 'coe_expiry',
          align: 'center',
        }, {
          title: 'Warranty Expiry',
          dataIndex: 'warranty_expiry',
          align: 'center',
        }, {
          title: 'Roadtax Expiry',
          dataIndex: 'roadtax_expiry',
          align: 'center',
        }];


        return (
              <Layout className="layout">
                <Header>
                  <div className="title">My Assets</div>
                </Header>
                <Content>
                  <Table dataSource={this.state.data} columns={columns} />
                </Content>
              </Layout>
        );
    }
}

export default Buyer_myassets;
