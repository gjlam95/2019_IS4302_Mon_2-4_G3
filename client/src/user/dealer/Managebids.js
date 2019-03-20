import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import { Button, Layout, Table, notification } from 'antd';
import './Managebids.css';
import { getAllUsers, deleteUser } from '../../util/APIUtils';

class Dealer_managebids extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    loadAllUsers() {
        getAllUsers()
        .then(data =>
          this.setState({ data }))
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

    onDelete(index) {
      deleteUser(index.nric)
      .then(response => {
          notification.success({
              message: 'EquiV',
              description: "You've successfully deleted a user!",
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
        this.loadAllUsers();
    }

    render() {
        const { Content } = Layout;

        const users_columns = [{
          title: 'Bid ID',
          dataIndex: 'nric',
          key: 'nric',
        }, {
          title: 'Listing',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'Highest Bid',
          dataIndex: 'role',
          key: 'role',
        }, {
          title: 'Bid Amount',
          key: 'remove',
          render: (index) => {
            return (
              <Button onClick={(e) => { e.stopPropagation(); this.onDelete(index); } } icon="user-delete"></Button>
            )
          }
        }];

        return (
              <Layout className="userlayout">
                <Content>
                  <div className="usertitle">
                    Bids
                  </div>
                  <Table dataSource={this.state.data} columns={users_columns}/>
                </Content>
              </Layout>
        );
    }
}

export default Dealer_managebids;
