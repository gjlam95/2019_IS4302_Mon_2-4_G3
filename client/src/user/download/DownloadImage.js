import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Layout, notification } from 'antd';
import { downloadImg } from '../../util/APIUtils'

class DownloadImage extends Component {
  constructor(props) {
      super(props);
      this.showOutput = this.showOutput.bind(this);
  }

  showOutput(filename) {
      downloadImg(filename)
      .then(response => {
        document.getElementById("image").src = response
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
      path: '/downloadImage/:filename',
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
      <img id="image" src="" alt="" width="500" height="500"/>
      </Layout>
    );
  }
}

export default DownloadImage;
