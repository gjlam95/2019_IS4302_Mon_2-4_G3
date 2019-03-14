import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import { getCurrentUser, logout } from '../util/APIUtils';
import { AUTH_TOKEN } from '../constants';

import Login from '../user/login/Login';
import AppHeader from '../common/AppHeader';
import Therapist_mysellers from '../user/therapist/Mysellers';
import Therapist_sellerrecords from '../user/therapist/Sellerrecords';
import Therapist_newnote from '../user/therapist/NewNote';
import Therapist_editnote from '../user/therapist/EditNote';
import Therapist_uploadrecord from '../user/therapist/UploadRecord';
import Seller_mydata from '../user/seller/MyData';
import Seller_newnote from '../user/seller/NewNote';
import Seller_editnote from '../user/seller/EditNote';
import Middleman_logs from '../user/middleman/Logs';
import Middleman_link_users from '../user/middleman/Linkusers';
import Middleman_manage_users from '../user/middleman/Manageusers';
import Middleman_add_user from '../user/middleman/Adduser';
import Evaluator_generate_data from '../user/evaluator/Generatedata';
import Dealer_add_user from '../user/dealer/Adduser';
import Dealer_upload_database from '../user/dealer/Uploaddatabase';
import LoadingIndicator from '../common/LoadingIndicator';
import SellerRoute from '../common/SellerRoute';
import TherapistRoute from '../common/TherapistRoute';
import EvaluatorRoute from '../common/EvaluatorRoute';
import MiddlemanRoute from '../common/MiddlemanRoute';
import DealerRoute from '../common/DealerRoute';
import NotFound from '../common/NotFound';

import { Layout, notification } from 'antd';
const { Content } = Layout;

const Home = () => (
  <div>
    <h1>Welcome to EquiV!</h1>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  handleLogout() {
    logout().then(response => {
      localStorage.removeItem(AUTH_TOKEN);
      this.setState({
        currentUser: null,
        isAuthenticated: false
      });
      this.props.history.push("/login");
      notification["success"]({
        message: 'EquiV',
        description: "You're successfully logged out.",
      });

    }).catch(error => {
        if(error.status === 401) {
            notification.error({
                message: 'EquiV',
                description: 'Your NRIC/Password/Role is/are incorrect. Please try again!'
            });
        } else {
            notification.error({
                message: 'EquiV',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        }
      })
  }

  handleLogin() {
    notification.success({
      message: 'EquiV',
      description: "You're successfully logged in.",
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
    }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillMount() {
    this.loadCurrentUser();
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }

    if(this.state.isAuthenticated) {
      if(this.state.currentUser.role === "seller") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <SellerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata/editnote/:id" component={Seller_editnote}></SellerRoute>
                    <SellerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata/newnote" component={Seller_newnote}></SellerRoute>
                    <SellerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata" component={Seller_mydata}></SellerRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "therapist") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mysellers/:nric/uploadrecord" component={Therapist_uploadrecord}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mysellers/:nric/editnote/:id" component={Therapist_editnote}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mysellers/:nric/newnote" component={Therapist_newnote}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mysellers/:nric" component={Therapist_sellerrecords}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mysellers" component={Therapist_mysellers}></TherapistRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "evaluator") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <EvaluatorRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/generatedata" component={Evaluator_generate_data}></EvaluatorRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "dealer") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <Route path="/login"
                      render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                    <DealerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/uploaddatabase" component={Dealer_upload_database}></DealerRoute>
                    <DealerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/adduser" component={Dealer_add_user}></DealerRoute>
                    <DealerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/link" component={Middleman_link_users}></DealerRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "middleman") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <MiddlemanRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/logs" component={Middleman_logs}></MiddlemanRoute>
                    <MiddlemanRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/link" component={Middleman_link_users}></MiddlemanRoute>
                    <MiddlemanRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/manageusers" component={Middleman_manage_users}></MiddlemanRoute>
                    <MiddlemanRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/adduser" component={Middleman_add_user}></MiddlemanRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <Route path="/login"
                      render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      }
    } else {
      return (
          <Layout className="app-container">
            <AppHeader isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout} />

            <Content className="app-content">
              <div className="container">
                <Switch>
                  <Route exact path="/" component={Home}>
                  </Route>
                  <Route path="/login"
                    render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                  <Route component={NotFound}></Route>
                </Switch>
              </div>
            </Content>
          </Layout>
      );
    }
  }
}

export default withRouter(App);
