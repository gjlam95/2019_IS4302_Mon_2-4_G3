import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Layout, notification } from 'antd';
import { downloadFile } from '../../util/APIUtils'

class DownloadFile extends Component {
  constructor(props) {
      super(props);
      this.showOutput = this.showOutput.bind(this);
      this.b64DecodeUnicode = this.b64DecodeUnicode.bind(this);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  showOutput(filename) {
      downloadFile(filename)
      .then(response => {
        document.getElementById('contents').innerHTML = this.b64DecodeUnicode(response);
      })
      .catch(error => {
        notification.error({
            message: 'EquiV',
            description: error.message || 'Sorry! Something went wrong. Please try again!'
        });
    });
  }

  componentDidMount() {
    const match = matchPath(this.props.history.location.pathname, {
      path: '/downloadFile/:filename',
      exact: true,
      strict: false
    })
      const filename = match.params.filename;
      this.showOutput(filename);
      this.setState({filename});
  }

  render() {
    return (
      <Layout className="app-container">
        <div id="contents"></div>
      </Layout>
    );
  }
}

export default DownloadFile;
