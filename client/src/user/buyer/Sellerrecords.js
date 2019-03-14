import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import { matchPath } from 'react-router';
import { getSellerPermittedRecords, getSellerProfile,
         getAllBuyerNotes, getCurrentUser, setNotePermission, checkNotePermission } from '../../util/APIUtils';
import { Layout, Table, Button, Checkbox, notification } from 'antd';
import update from 'immutability-helper';
import './Sellerrecords.css';

const { Content } = Layout;

class Buyer_sellerrecords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patrecords: [],
            mynotes: [],
            othernotes: [],
            seller: null,
            currentUser: null,
            permissionadded: false,
            isLoading: false
        }
        this.getCurrentBuyer = this.getCurrentBuyer.bind(this);
        this.loadSellerRecords = this.loadSellerRecords.bind(this);
        this.loadSellerProfile = this.loadSellerProfile.bind(this);
        this.loadNotes = this.loadNotes.bind(this);
        this.radioOnChange = this.radioOnChange.bind(this);

    }

    getCurrentBuyer() {
        this.setState({
            isLoading: true
        });

        getCurrentUser()
        .then((response) => {
            this.setState({
                currentUser: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    loadNotes(pat_nric) {
      this.setState({
          isLoading: true
      });

      getAllBuyerNotes(pat_nric)
      .then((response) => {

          const mydata = [];
          const otherdata = [];
          const mynric = this.state.currentUser.nric;
          var me = 0;
          var other = 0;

          for (var i = 0; i < response.content.length; i++) {
              var currentnric = response.content[i].creatorNric;
              if (mynric === currentnric) {
                  mydata[me] = response.content[i];
                  me++;
              } else {
                  otherdata[other] = response.content[i];
                  other++;
              }
          }

          this.setState({
              mynotes: mydata,
              othernotes: otherdata
          });

          if (mydata.length === 0) {
              this.setState({
                  permissionadded: true
              });
          }

          for (var j = 0; j < mydata.length; j++) {
              const currentid = mydata[j].noteID;

              const index = j;
              const final_count = mydata.length - 1;

              checkNotePermission(currentid)
              .then(response => {

                  if (response.message.includes("does NOT")) {
                    this.setState({ mynotes: update(this.state.mynotes, {[index]: { defaultPermission: {$set: false} }}) });
                  } else {
                    this.setState({ mynotes: update(this.state.mynotes, {[index]: { defaultPermission: {$set: true} }}) });
                  }


                  if (index === final_count) {
                    this.setState({
                        permissionadded: true
                    });
                  }
              }).catch(error => {
                  this.setState({ mynotes: update(this.state.mynotes, {[index]: { defaultPermission: {$set: false} }}) });
              });
          }

          this.setState({
              isLoading: false
          });

      }).catch(error => {
          if(error.status === 404) {
              this.setState({
                  notFound: true,
                  isLoading: false
              });
          } else {
              this.setState({
                  serverError: true,
                  isLoading: false
              });
          }
      });
    }

    loadSellerRecords(pat_nric) {
        this.setState({
            isLoading: true
        });

        getSellerPermittedRecords(pat_nric)
        .then((patdata) => {
            this.setState({ patrecords: patdata.content,
                            isLoading: false });
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

    loadSellerProfile(pat_nric) {
        this.setState({
            isLoading: true
        });

        getSellerProfile(pat_nric)
        .then(response => {
            this.setState({
                seller: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    radioOnChange(e) {
      const checked = e.target.checked;
      if (checked) {
        const notePermissionRequest = {
            noteID: e.target.value,
            isVisibleToSeller: "true"
        };
        setNotePermission(notePermissionRequest)
        .then(response => {

        }).catch(error => {
            notification.error({
                message: 'EquiV',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            e.target.checked = "false";
        });
      } else {
        const notePermissionRequest = {
            noteID: e.target.value,
            isVisibleToSeller: "false"
        };
        setNotePermission(notePermissionRequest)
        .then(response => {

        }).catch(error => {
            notification.error({
                message: 'EquiV',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            e.target.checked = "true";
        });
      }
    }

    componentDidMount() {
        const match = matchPath(this.props.history.location.pathname, {
          path: '/mysellers/:nric',
          exact: true,
          strict: false
        });
        const pat_nric = match.params.nric;
        this.getCurrentBuyer();
        this.loadSellerProfile(pat_nric);
        this.loadNotes(pat_nric);
        this.loadSellerRecords(pat_nric);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.nric !== nextProps.match.params.nric) {
            this.getCurrentBuyer();
            this.loadSellerProfile(nextProps.match.params.nric);
            this.loadNotes(nextProps.match.params.nric);
            this.loadSellerRecords(nextProps.match.params.nric);

        }
    }
    // Change the columns? Add links to the docs?
    render() {

        const patcolumns = [{
          title: 'Record ID',
          dataIndex: 'recordID',
          key: 'recordID',
          align: 'center',
        }, {
          title: 'Title',
          dataIndex: 'title',
          align: 'center',
        }, {
          title: 'Type',
          dataIndex: 'type',
          align: 'center',
        }, {
          title: 'Subtype',
          dataIndex: 'subtype',
          align: 'center',
        }, {
          title: 'File',
          dataIndex: 'document',
          align: 'center',
          render: text => {
            var url = text.split("/")
            url = url[url.length-1]
            if (url.endsWith(".mp4"))
              text = "/downloadVideo/" + url
            else if (url.endsWith(".jpg") || url.endsWith(".png"))
              text = "/downloadImage/" + url
            else if (url.endsWith(".txt"))
              text = "/downloadFile/" + url
            else if (url.endsWith(".csv"))
              text = "/downloadCSV/" + url

            return <a href={text}>{url}</a>
          }
        }];

        const othernotescolumns = [{
          title: 'Note ID',
          dataIndex: 'noteID',
          key: 'noteID',
          align: 'center',
        }, {
          title: 'Content',
          dataIndex: 'noteContent',
          align: 'center',
          width: '50%'
        }, {
          title: 'Written By',
          dataIndex: 'creatorName',
          align: 'center',
        }];

        const mynotescolumns = [{
          title: 'Note ID',
          dataIndex: 'noteID',
          key: 'noteID',
          align: 'center',
        }, {
          title: 'Content',
          dataIndex: 'noteContent',
          align: 'center',
          width: '50%'
        }, {
          title: '',
          dataIndex: 'defaultPermission',
          render: text => ''
        },{
          title: 'Allow seller to view?',
          dataIndex: 'consent',
          width: '20%',
          align: 'center',
          render: (text, row) => <Checkbox value={row.noteID} defaultChecked={row.defaultPermission}
                                  onChange={this.radioOnChange}></Checkbox>
        }, {
          title: 'Action',
          dataIndex: 'edit',
          align: 'center',
          render: (text, row) => <a href={ this.props.history.location.pathname + "/editnote/" + row.noteID }>Edit</a>
        }];

        return (
          <div className="seller-data">
            {  (this.state.permissionadded && this.state.seller && this.state.patrecords) ? (
                <Layout className="layout">
                  <Content>
                    <div style={{ background: '#ECECEC' }}>
                      <div className="name">&nbsp;&nbsp;{this.state.seller.name}</div>
                      <div className="subtitle">&nbsp;&nbsp;&nbsp;&nbsp;NRIC: {this.state.seller.nric}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone Number: {this.state.seller.phone}</div>
                      <br />
                    </div>
                    <div className="title">
                      Seller's Records &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Link to={ this.props.history.location.pathname + "/uploadrecord"}>
                        <Button type="primary" icon="upload" size="default">Upload record</Button>
                      </Link>
                    </div>
                    <Table dataSource={this.state.patrecords} columns={patcolumns} rowKey="recordID" />
                    <div className="title">
                      Other Buyers' Notes
                    </div>
                    <Table dataSource={this.state.othernotes} columns={othernotescolumns} rowKey="noteID" />
                    <div className="title">
                      My Notes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Link to={ this.props.history.location.pathname + "/newnote" }>
                        <Button type="primary" icon="file-add" size="default">New note</Button>
                      </Link>
                    </div>
                    <Table dataSource={this.state.mynotes} columns={mynotescolumns} rowKey="noteID" />
                  </Content>
                </Layout>
              ): null
            }
          </div>
        );
    }
}

export default Buyer_sellerrecords;
