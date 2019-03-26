import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const Header = Layout.Header;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick({ key }) {
    if(key === "logout") {
      this.props.onLogout();
    }
  }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          if(this.props.currentUser.role === "evaluator") {
            menuItems = [
              <Menu.Item key="/generatedata">
                <Link to="/generatedata">
                  <Icon type="bar-chart" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          } else if(this.props.currentUser.role === "dealer") {
            menuItems = [
              <Menu.Item key="/mylistings">
                <Link to="/mylistings">
                  <Icon type="medicine-box" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/managebids">
                <Link to="/managebids">
                  <Icon type="swap" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          } else if(this.props.currentUser.role === "seller") {
            menuItems = [
              <Menu.Item key="/mydata">
                <Link to="/mydata">
                  <Icon type="reconciliation" theme="outlined" className="nav-icon" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          } else if(this.props.currentUser.role === "buyer") {
            menuItems = [
              <Menu.Item key="/myassets">
                <Link to="/myassets">
                  <Icon type="medicine-box" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/pay">
                <Link to="/pay">
                  <Icon type="swap" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/rate">
                <Link to="/rate">
                  <Icon type="edit" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          } else if(this.props.currentUser.role === "middleman") {
            menuItems = [
              <Menu.Item key="/logs">
                <Link to="/logs">
                  <Icon type="database" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/pay">
                <Link to="/pay">
                  <Icon type="swap" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/manageusers">
                <Link to="/manageusers">
                  <Icon type="usergroup-add" />
                </Link>
              </Menu.Item>,
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          } else {
            menuItems = [
              <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu
                  currentUser={this.props.currentUser}
                  handleMenuClick={this.handleMenuClick}/>
              </Menu.Item>
            ];
          }
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>
          ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">EquiV</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
      }
}

function ProfileDropdownMenu(props) {
  var dropdownMenu = '';

  dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
    <Menu.Item key="user-info" className="dropdown-item" disabled>
    <div className="user-full-name-info">
    {props.currentUser.name}
    </div>
    <div className="nric-info">
    @{props.currentUser.nric}
    </div>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout" className="dropdown-item">
    Logout
    </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
    overlay={dropdownMenu}
    trigger={['click']}
    getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
    <a href="/" className="ant-dropdown-pay">
    <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
    </a>
    </Dropdown>
  );
}

export default withRouter(AppHeader);
