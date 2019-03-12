import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import { getMyRecords, giveTherapistPermission,
         removeTherapistPermission, getMyNotes,
         getGivenPermissions, getTherapistNotes,
         getAllMyTherapists } from '../../util/APIUtils';
import { Layout, Table, Button, Select, notification } from 'antd';
import update from 'immutability-helper';
import './MyData.css';

const Option = Select.Option;
const { Content } = Layout;

class Patient_mydata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myrecords: [],
            mytherapists: [],
            mynotes: [],
            therapistsnotes: [],
            myrecordscompleted: false,
            mytherapistscompleted: false,
            mynotescompleted: false,
            therapistsnotescompleted: false,
            isLoading: false
        }

        this.loadMyTherapists = this.loadMyTherapists.bind(this);
        this.loadMyRecords = this.loadMyRecords.bind(this);
        this.loadNotes = this.loadNotes.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeselect = this.handleDeselect.bind(this);
        this.generateTherapistOptions = this.generateTherapistOptions.bind(this);

    }

    generateTherapistOptions(rec_id) {
      const mytherapistoptions = [];

      for (var i = 0; i < this.state.mytherapists.length; i++) {
          mytherapistoptions.push(<Option ref={rec_id} key={i} value={this.state.mytherapists[i].nric}>{this.state.mytherapists[i].name}</Option>);
      }

      return mytherapistoptions;
    }


    loadMyTherapists() {
        this.setState({
            isLoading: true
        });

        getAllMyTherapists()
        .then(response => {
            const mytherapists = [];

            for (var i = 0; i < response.content.length; i++) {
                const therapistnric = response.content[i].treatmentId.therapist;
                const therapistname = response.content[i].therapistName;
                mytherapists[i] = { nric: therapistnric,
                                    name: therapistname };
            }

            this.setState({
                mytherapists: mytherapists,
                mytherapistscompleted: true,
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
              myrec[i].permittedTherapists = [];
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
              const therapistic = currperm.therapistNric;
              for (var j = 0; j < this.state.myrecords.length; j++) {
                  if (recid === this.state.myrecords[j].recordID) {
                        const prevList = this.state.myrecords[j].permittedTherapists;
                        this.setState({ myrecords: update(this.state.myrecords, {[j]: { permittedTherapists: {$set: [...prevList, therapistic]} }}) });
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

      getTherapistNotes()
      .then((response) => {

          const therapnotes = [];

          for (var i = 0; i < response.content.length; i++) {
              therapnotes[i] = response.content[i];
          }

          this.setState({
              therapistsnotes: therapnotes,
              therapistsnotescompleted: true
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

    handleSelect(therapist_nric, option) {
      const record_id = option.ref;

      const recordPermissionRequest = {
          recordID: record_id,
          therapistNric: therapist_nric,
          endDate: "9999-12-30"
      };

      giveTherapistPermission(recordPermissionRequest)
      .then(response => {

      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    handleDeselect(therapist_nric, option) {
      const record_id = option.ref;

      const revokePermissionRequest = {
          recordID: record_id,
          therapistNric: therapist_nric
      };

      removeTherapistPermission(revokePermissionRequest)
      .then(response => {

      }).catch(error => {
          notification.error({
              message: 'EquiV',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
    }

    componentDidMount() {
        this.loadMyTherapists();
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
          dataIndex: 'permittedTherapists',
          render: text => ''
        },{
          title: 'Allow therapist(s) to view',
          dataIndex: 'consent',
          width: '20%',
          align: 'center',
          render: (text, row) => <Select mode="multiple" placeholder="Select therapist(s)" style={{ width: '100%' }}
                                  onSelect={this.handleSelect} onDeselect={this.handleDeselect}
                                  defaultValue={row.permittedTherapists}>
                                      {this.generateTherapistOptions(row.recordID)}
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

        const therapistsnotescolumns = [{
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
          <div className="patient-data">
           {  (this.state.myrecordscompleted && this.state.mynotescompleted && this.state.mytherapists && this.state.therapistsnotescompleted) ? (
                 <Layout className="layout">
                   <Content>
                     <div className="title">
                       My Records
                     </div>
                     <Table dataSource={this.state.myrecords} columns={reccolumns} rowKey="recordID" />
                     <div className="title">
                       My Therapists' Notes
                     </div>
                     <Table dataSource={this.state.therapistsnotes} columns={therapistsnotescolumns} rowKey="noteID" />
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

export default Patient_mydata;
