import React, { Component } from 'react';
import { Layout } from 'antd';
import { getLogs } from '../../util/APIUtils';
import './Logs.css';

class Administrator_logs extends Component {
  constructor(props) {
      super(props);
      this.state = {
          data: []
      }
      this.b64DecodeUnicode = this.b64DecodeUnicode.bind(this);
      this.getServerLogs = this.getServerLogs.bind(this);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  getServerLogs() {
      getLogs()
      .then(response => {
        var str = this.b64DecodeUnicode(response)
        var arr = str.split("2018")
        var i
        for (i = 1; i < arr.length; i++) {
          arr[i] = "2018" + arr[i] + "<br><br>"
        }
        document.getElementById('contents').innerHTML = arr;
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

  componentDidMount() {
      this.getServerLogs();
  }

    render() {
        return (
          <Layout className="layout">
          <div id="contents"></div>
          </Layout>
        );
    }
}

export default Administrator_logs;
