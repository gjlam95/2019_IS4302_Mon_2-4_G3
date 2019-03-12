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
import DownloadVideo from '../user/download/DownloadVideo';
import DownloadImage from '../user/download/DownloadImage';
import DownloadFile from '../user/download/DownloadFile';
import DownloadCSV from '../user/download/DownloadCSV';
import AppHeader from '../common/AppHeader';
import Therapist_mypatients from '../user/therapist/Mypatients';
import Therapist_patientrecords from '../user/therapist/Patientrecords';
import Therapist_newnote from '../user/therapist/NewNote';
import Therapist_editnote from '../user/therapist/EditNote';
import Therapist_uploadrecord from '../user/therapist/UploadRecord';
import Patient_mydata from '../user/patient/MyData';
import Patient_newnote from '../user/patient/NewNote';
import Patient_editnote from '../user/patient/EditNote';
import Administrator_logs from '../user/administrator/Logs';
import Administrator_link_users from '../user/administrator/Linkusers';
import Administrator_manage_users from '../user/administrator/Manageusers';
import Administrator_add_user from '../user/administrator/Adduser';
import Researcher_generate_data from '../user/researcher/Generatedata';
import External_add_user from '../user/external_partner/Adduser';
import External_upload_database from '../user/external_partner/Uploaddatabase';
import LoadingIndicator from '../common/LoadingIndicator';
import PatientRoute from '../common/PatientRoute';
import TherapistRoute from '../common/TherapistRoute';
import ResearcherRoute from '../common/ResearcherRoute';
import AdministratorRoute from '../common/AdministratorRoute';
import ExternalPartnerRoute from '../common/ExternalPartnerRoute';
import NotFound from '../common/NotFound';

import { Layout, notification } from 'antd';
const { Content } = Layout;

const Home = () => (
  <div>
    <h1>Welcome to the Healthcare App Webpage!</h1>
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
        message: 'Healthcare App',
        description: "You're successfully logged out.",
      });

    }).catch(error => {
        if(error.status === 401) {
            notification.error({
                message: 'Healthcare App',
                description: 'Your NRIC/Password/Role is/are incorrect. Please try again!'
            });
        } else {
            notification.error({
                message: 'Healthcare App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        }
      })
  }

  handleLogin() {
    notification.success({
      message: 'Healthcare App',
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
      if(this.state.currentUser.role === "patient") {
        return (
            <Layout className="app-container">
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout} />

              <Content className="app-content">
                <div className="container">
                  <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata/editnote/:id" component={Patient_editnote}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata/newnote" component={Patient_newnote}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mydata" component={Patient_mydata}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadVideo/:filename" component={DownloadVideo}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadImage/:filename" component={DownloadImage}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadFile/:filename" component={DownloadFile}></PatientRoute>
                    <PatientRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadCSV/:filename" component={DownloadCSV}></PatientRoute>
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
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mypatients/:nric/uploadrecord" component={Therapist_uploadrecord}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadVideo/:filename" component={DownloadVideo}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadImage/:filename" component={DownloadImage}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadFile/:filename" component={DownloadFile}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/downloadCSV/:filename" component={DownloadCSV}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mypatients/:nric/editnote/:id" component={Therapist_editnote}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mypatients/:nric/newnote" component={Therapist_newnote}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mypatients/:nric" component={Therapist_patientrecords}></TherapistRoute>
                    <TherapistRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/mypatients" component={Therapist_mypatients}></TherapistRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "researcher") {
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
                    <ResearcherRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/generatedata" component={Researcher_generate_data}></ResearcherRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "external partner") {
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
                    <ExternalPartnerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/uploaddatabase" component={External_upload_database}></ExternalPartnerRoute>
                    <ExternalPartnerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/adduser" component={External_add_user}></ExternalPartnerRoute>
                    <ExternalPartnerRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/link" component={Administrator_link_users}></ExternalPartnerRoute>
                    <Route component={NotFound}></Route>
                  </Switch>
                </div>
              </Content>
            </Layout>
        );
      } else if(this.state.currentUser.role === "administrator") {
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
                    <AdministratorRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/logs" component={Administrator_logs}></AdministratorRoute>
                    <AdministratorRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/link" component={Administrator_link_users}></AdministratorRoute>
                    <AdministratorRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/manageusers" component={Administrator_manage_users}></AdministratorRoute>
                    <AdministratorRoute authenticated={this.state.isAuthenticated} role={this.state.currentUser.role} path="/adduser" component={Administrator_add_user}></AdministratorRoute>
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
