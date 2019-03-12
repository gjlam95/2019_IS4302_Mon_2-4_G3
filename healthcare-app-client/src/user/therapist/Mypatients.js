import React, { Component } from 'react';
import update from 'immutability-helper';
import findIndex from 'lodash.findindex';
import { Layout, Table } from 'antd';
import { getPatients, getPatientProfile } from '../../util/APIUtils';
import './Mypatients.css';

const { Header, Content } = Layout;

class Therapist_mypatients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            isLoading: false
        }

        this.loadPatients = this.loadPatients.bind(this);
    }

    loadPatients() {
        this.setState({
            isLoading: true
        });

        getPatients()
        .then(response => {
                const patdata = [];

                for (var i = 0; i < response.content.length; i++) {
                    var currentnric = response.content[i].treatmentId.patient;

                    patdata[i] = ({ key: i,
                                    nric: currentnric
                                  });
                }

                this.setState({ patients: patdata });

                for (var j = 0; j < response.content.length; j++) {

                    var currnric = response.content[j].treatmentId.patient;

                    getPatientProfile(currnric)
                    .then((result) => { var i = findIndex(this.state.patients, ['nric', result.nric]);
                                        this.setState({ patients: update(this.state.patients, {[i]: { name: {$set: result.name},
                                                                                                      phone: {$set: result.phone} }}) });
                                      }
                    ).catch(error => {
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
              }
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
        this.loadPatients();
    }

    render() {

        const columns = [{
          title: 'NRIC',
          dataIndex: 'nric',
          key: 'nric',
          align: 'center',
        },  {
          title: 'Name',
          dataIndex: 'name',
          align: 'center',
          defaultSortOrder: 'ascend',
          sorter: (a, b) => a.name - b.name
        },  {
          title: 'Phone',
          dataIndex: 'phone',
          align: 'center',
        },  {
          title: 'Documents & records',
          dataIndex: 'docs_recs',
          align: 'center',
          render: (text, row) => <a href={ "/mypatients/" + row.nric }>View, Edit or Create</a>,
        }];


        return (
              <Layout className="layout">
                <Header>
                  <div className="title">My Patients</div>
                </Header>
                <Content>
                  <Table dataSource={this.state.patients} columns={columns} rowKey="nric" />
                </Content>
              </Layout>
        );
    }
}

export default Therapist_mypatients;
