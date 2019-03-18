import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import { getMyRecords, giveBuyerPermission,
         removeBuyerPermission, getMyNotes,
         getGivenPermissions, getBuyerNotes,
         getAllMyBuyers } from '../../util/APIUtils';
import { Layout, Table, Button, Select, notification } from 'antd';
import update from 'immutability-helper';
import './MyData.css';

const Option = Select.Option;
const { Content } = Layout;

class Seller_mydata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myrecords: [],
            mybuyers: [],
            mynotes: [],
            buyersnotes: [],
            myrecordscompleted: false,
            mybuyerscompleted: false,
            mynotescompleted: false,
            buyersnotescompleted: false,
            isLoading: false
        }

        this.loadMyBuyers = this.loadMyBuyers.bind(this);
        this.loadMyRecords = this.loadMyRecords.bind(this);
        this.loadNotes = this.loadNotes.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeselect = this.handleDeselect.bind(this);
        this.generateBuyerOptions = this.generateBuyerOptions.bind(this);

    }

    generateBuyerOptions(rec_id) {
      const mybuyeroptions = [];

      for (var i = 0; i < this.state.mybuyers.length; i++) {
          mybuyeroptions.push(<Option ref={rec_id} key={i} value={this.state.mybuyers[i].nric}>{this.state.mybuyers[i].name}</Option>);
      }

      return mybuyeroptions;
    }


    loadMyBuyers() {
        this.setState({
            isLoading: true
        });

        getAllMyBuyers()
        .then(response => {
            const mybuyers = [];

            for (var i = 0; i < response.content.length; i++) {
                const buyernric = response.content[i].treatmentId.buyer;
                const buyername = response.content[i].buyerName;
                mybuyers[i] = { nric: buyernric,
                                    name: buyername };
            }

            this.setState({
                mybuyers: mybuyers,
                mybuyerscompleted: true,
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

    loadMyRecords() {
      this.setState({
          isLoading: true
      });

      getMyRecords()
      .then((response) => {

          const myrec = [];

          for (var i = 0; i < response.content.length; i++) {
              myrec[i] = response.content[i];
              myrec[i].permittedBuyers = [];
          }

          this.setState({
              myrecords: myrec
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

      getGivenPermissions()
      .then((response) => {

          for (var i = 0; i < response.content.length; i++) {
              const currperm = response.content[i];
              const recid = currperm.recordID;
              const buyeric = currperm.buyerNric;
              for (var j = 0; j < this.state.myrecords.length; j++) {
                  if (recid === this.state.myrecords[j].recordID) {
                        const prevList = this.state.myrecords[j].permittedBuyers;
                        this.setState({ myrecords: update(this.state.myrecords, {[j]: { permittedBuyers: {$set: [...prevList, buyeric]} }}) });
                  }
              }
          }

          this.setState({
              myrecordscompleted: true,
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

    loadNotes() {
      this.setState({
          isLoading: true
      });

      getBuyerNotes()
      .then((response) => {

          const therapnotes = [];

          for (var i = 0; i < response.content.length; i++) {
              therapnotes[i] = response.content[i];
          }

          this.setState({
              buyersnotes: therapnotes,
              buyersnotescompleted: true
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

      getMyNotes()
      .then((response) => {

          const myNotes = [];

          for (var i = 0; i < response.content.length; i++) {
              myNotes[i] = response.content[i];
          }

          this.setState({
              mynotes: myNotes,
              mynotescompleted: true
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

      this.setState({
          isLoading: false
      });
    }

    handleSelect(buyer_nric, option) {
      const record_id = option.ref;

      const recordPermissionRequest = {
          recordID: record_id,
          buyerNric: buyer_nric,
          endDate: "9999-12-30"
      };

      giveBuyerPermission(recordPermissionRequest)
      .then(response => {

      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    handleDeselect(buyer_nric, option) {
      const record_id = option.ref;

      const revokePermissionRequest = {
          recordID: record_id,
          buyerNric: buyer_nric
      };

      removeBuyerPermission(revokePermissionRequest)
      .then(response => {

      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    componentDidMount() {
        this.loadMyBuyers();
        this.loadMyRecords();
        this.loadNotes();
    }


    render() {

        const reccolumns = [{
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
          title: '',
          dataIndex: 'permittedBuyers',
          render: text => ''
        },{
          title: 'Allow buyer(s) to view',
          dataIndex: 'consent',
          width: '20%',
          align: 'center',
          render: (text, row) => <Select mode="multiple" placeholder="Select buyer(s)" style={{ width: '100%' }}
                                  onSelect={this.handleSelect} onDeselect={this.handleDeselect}
                                  defaultValue={row.permittedBuyers}>
                                      {this.generateBuyerOptions(row.recordID)}
                                 </Select>
        }, {
          title: 'File',
          dataIndex: 'document',
          align: 'center',
          render: text => {
            var url = text.split("/")
            url = url[url.length-1]
            if (url.includes(".mp4"))
              text = "/downloadVideo/" + url
            else if (url.includes(".jpg") || url.includes(".png"))
              text = "/downloadImage/" + url
            else if (url.includes(".txt"))
              text = "/downloadFile/" + url
            else if (url.includes(".csv"))
              text = "/downloadCSV/" + url

            return <a href={text}>{url}</a>
          }
        }];

        const buyersnotescolumns = [{
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
          title: 'Action',
          dataIndex: 'edit',
          align: 'center',
          render: (text, row) => <a href={ this.props.history.location.pathname + "/editnote/" + row.noteID }>Edit</a>
        }];

        return (
          <div className="seller-data">
           {  (this.state.myrecordscompleted && this.state.mynotescompleted && this.state.mybuyers && this.state.buyersnotescompleted) ? (
                 <Layout className="layout">
                   <Content>
                     <div className="title">
                       My Records
                     </div>
                     <Table dataSource={this.state.myrecords} columns={reccolumns} rowKey="recordID" />
                     <div className="title">
                       My Buyers' Notes
                     </div>
                     <Table dataSource={this.state.buyersnotes} columns={buyersnotescolumns} rowKey="noteID" />
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

export default Seller_mydata;
