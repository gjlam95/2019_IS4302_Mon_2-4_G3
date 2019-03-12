import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import { Button, Layout, Table, notification } from 'antd';
import './Manageusers.css';
import { getAllUsers, deleteUser } from '../../util/APIUtils';

class AddUserButton extends Component {
  render() {
    return (
      <Link to="/adduser">
        <Button type="primary" icon="user-add" size="default">Add user</Button>
      </Link>
    );
  }
}

class Administrator_manage_users extends Component {
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
              message: 'Healthcare App',
              description: "You've successfully deleted a user!",
          });
          window.location.reload();
      }).catch(error => {
          notification.error({
              message: 'Healthcare App',
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
          title: 'NRIC',
          dataIndex: 'nric',
          key: 'nric',
        }, {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        }, {
          title: 'Phone number',
          dataIndex: 'phone',
          key: 'phone',
        }, {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        }, {
          title: 'Remove?',
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
                    Users&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<AddUserButton />
                  </div>
                  <Table dataSource={this.state.data} columns={users_columns}/>
                </Content>
              </Layout>
        );
    }
}

export default Administrator_manage_users;
