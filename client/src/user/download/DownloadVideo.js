import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Layout, notification } from 'antd';
import { downloadVideo } from '../../util/APIUtils'

var blob, filename, video;

class DownloadVideo extends Component {
  constructor(props) {
      super(props);
      this.state = {
        filename: ''
      }
      this.handleInitSuccess = this.handleInitSuccess.bind(this);
      this.createFile = this.createFile.bind(this);
      this.showOutput = this.showOutput.bind(this);
  }

  handleInitSuccess(fileSystem) {
    window.fileSystem = fileSystem;
    this.createFile('video.mp4');
  }

  createFile(fullPath) {
    filename = this.state.filename;
    window.fileSystem.root.getFile(fullPath, {
      create: true
      /* exclusive: true */
    },
    function(fileEntry) {
      downloadVideo(filename)
      .then(response => {
        blob = new Blob([new Uint8Array(response)], {
          type: 'video/mp4'
        });
        // Create a FileWriter object for fileEntry
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function() {
            // read from file
            window.fileSystem.root.getFile(fullPath, {}, function(fileEntry) {
              // Get a File object representing the file
              // then use FileReader to read its contents
              fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                  // video.src = this.result;
                  video.src = URL.createObjectURL(new Blob([this.result]));
                };
                // reader.readAsDataURL(file);
                reader.readAsArrayBuffer(file);
              });
            });
          };
          // Create a new Blob and write it to file
          fileWriter.write(blob);
        });
      })
      .catch(error => {
        notification.error({
            message: 'EquiV',
            description: error.message || 'Sorry! Something went wrong. Please try again!'
      });
      });
    });
  }

  showOutput(filename) {
      video = document.querySelector('video');
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, 15 * 1024 * 1024, // 15MB
          this.handleInitSuccess);
        document.querySelector('video').addEventListener('loadedmetadata', function() {
          this.currentSrc.replace(/^.*[\\/]/, '');
  });
}

  componentDidMount() {
    const match = matchPath(this.props.history.location.pathname, {
      path: '/downloadVideo/:filename',
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
      <video autoplay controls preload="metadata">Your browser does not support the video element</video>
      <p id="videoSrc"></p>
      </Layout>
    );
  }
}

export default DownloadVideo;
