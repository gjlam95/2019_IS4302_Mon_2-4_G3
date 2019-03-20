import React, { Component } from "react";
import "./App.css";
import { Route, withRouter, Switch } from "react-router-dom";

import { getCurrentUser } from "../util/APIUtils";
import { AUTH_TOKEN } from "../constants";

import Login from "../user/login/Login";
import AppHeader from "../common/AppHeader";
import Buyer_mysellers from "../user/buyer/Mysellers";
import Buyer_sellerrecords from "../user/buyer/Sellerrecords";
import Buyer_newnote from "../user/buyer/NewNote";
import Buyer_editnote from "../user/buyer/EditNote";
import Buyer_uploadrecord from "../user/buyer/UploadRecord";
import Dealer_managebids from "../user/dealer/Managebids";
import Dealer_mylistings from "../user/dealer/Mylistings";
import Seller_mydata from "../user/seller/MyData";
import Seller_newnote from "../user/seller/NewNote";
import Seller_editnote from "../user/seller/EditNote";
import Middleman_logs from "../user/middleman/Logs";
import Middleman_link_users from "../user/middleman/Linkusers";
import Middleman_manage_users from "../user/middleman/Manageusers";
import Middleman_add_user from "../user/middleman/Adduser";
import Evaluator_generate_data from "../user/evaluator/Generatedata";
import LoadingIndicator from "../common/LoadingIndicator";
import SellerRoute from "../common/SellerRoute";
import BuyerRoute from "../common/BuyerRoute";
import EvaluatorRoute from "../common/EvaluatorRoute";
import MiddlemanRoute from "../common/MiddlemanRoute";
import DealerRoute from "../common/DealerRoute";
import NotFound from "../common/NotFound";

import { Layout, notification } from "antd";
const { Content } = Layout;

const Home = () => (
  <div>
    <h1>Welcome to EquiV!</h1>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);

    notification.config({
      placement: "topRight",
      top: 70,
      duration: 3
    });
  }

  handleLogout() {
    localStorage.removeItem(AUTH_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false
    });
    this.props.history.push("/login");
    notification["success"]({
      message: "EquiV",
      description: "You're successfully logged out."
    });
  }

  handleLogin() {
    notification.success({
      message: "EquiV",
      description: "You're successfully logged in."
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillMount() {
    this.loadCurrentUser();
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    if (this.state.isAuthenticated) {
      if (this.state.currentUser.role === "seller") {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <SellerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mydata/editnote/:id"
                    component={Seller_editnote}
                  />
                  <SellerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mydata/newnote"
                    component={Seller_newnote}
                  />
                  <SellerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mydata"
                    component={Seller_mydata}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      } else if (this.state.currentUser.role === "buyer") {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <BuyerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mysellers/:nric/uploadrecord"
                    component={Buyer_uploadrecord}
                  />
                  <BuyerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mysellers/:nric/editnote/:id"
                    component={Buyer_editnote}
                  />
                  <BuyerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mysellers/:nric/newnote"
                    component={Buyer_newnote}
                  />
                  <BuyerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mysellers/:nric"
                    component={Buyer_sellerrecords}
                  />
                  <BuyerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mysellers"
                    component={Buyer_mysellers}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      } else if (this.state.currentUser.role === "evaluator") {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <EvaluatorRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/generatedata"
                    component={Evaluator_generate_data}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      } else if (this.state.currentUser.role === "dealer") {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route
                    path="/login"
                    render={props => (
                      <Login onLogin={this.handleLogin} {...props} />
                    )}
                  />
                  <DealerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/mylistings"
                    component={Dealer_mylistings}
                  />
                  <DealerRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/managebids"
                    component={Dealer_managebids}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      } else if (this.state.currentUser.role === "middleman") {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <MiddlemanRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/logs"
                    component={Middleman_logs}
                  />
                  <MiddlemanRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/link"
                    component={Middleman_link_users}
                  />
                  <MiddlemanRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/manageusers"
                    component={Middleman_manage_users}
                  />
                  <MiddlemanRoute
                    authenticated={this.state.isAuthenticated}
                    role={this.state.currentUser.role}
                    path="/adduser"
                    component={Middleman_add_user}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      } else {
        return (
          <Layout className="app-container">
            <AppHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
            />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route
                    path="/login"
                    render={props => (
                      <Login onLogin={this.handleLogin} {...props} />
                    )}
                  />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        );
      }
    } else {
      return (
        <Layout className="app-container">
          <AppHeader
            isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout}
          />

          <Content className="app-content">
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route
                  path="/login"
                  render={props => (
                    <Login onLogin={this.handleLogin} {...props} />
                  )}
                />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
        </Layout>
      );
    }
  }
}

export default withRouter(App);
