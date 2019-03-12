import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Layout, notification } from 'antd';
import { downloadFile } from '../../util/APIUtils';
import c3 from 'c3';
import 'c3/c3.css';

class DownloadCSV extends Component {
  constructor(props) {
      super(props);
      this.showOutput = this.showOutput.bind(this);
      this.b64DecodeUnicode = this.b64DecodeUnicode.bind(this);
      this.createGraph = this.createGraph.bind(this);
      this.parseData = this.parseData.bind(this);
      this.replaceAll = this.replaceAll.bind(this);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  createGraph(data) {
    	var xAxis = [];
    	var yAxis1 = ["Systolic"];
      var yAxis2 = ["Diastolic"];

    	for (var i = 0; i < data.length-1; i++) {
          if (data[i][0] !== undefined && data[i][0] !== null
              && data[i][1] !== undefined && data[i][1] !== null
            && data[i][2] !== undefined && data[i][2] !== null) {
              xAxis.push(data[i][0]);
              yAxis1.push(data[i][1]);
              yAxis2.push(data[i][2]);
          } else {
              xAxis.push(0);
              yAxis1.push(0);
              yAxis2.push(0);
          }
    	}

    	c3.generate({
          bindto: '#chart',
    	    data: {
    	        columns: [
    	        	yAxis1, yAxis2
    	        ]
    	    },
    	    axis: {
    	        x: {
    	            type: 'category',
    	            categories: xAxis,
    	            tick: {
    	            	multiline: false,
                    	culling: {
                        	max: 15
                    	}
                	}
    	        }
    	    },
    	    zoom: {
            	enabled: true
        	},
    	    legend: {
    	        position: 'right'
    	    }
    	});
  }

  parseData(file) {
      var csvFilePath = file;
      var Papa = require("papaparse/papaparse.min.js");
  	  var results = Papa.parse(csvFilePath);
      this.createGraph(results.data);
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  showOutput(filename) {
      downloadFile(filename)
      .then(response => {
        const str = this.replaceAll(this.b64DecodeUnicode(response), "/", ",");
        this.parseData(str);
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
      path: '/downloadCSV/:filename',
      exact: true,
      strict: false
    })
      const filename = match.params.filename;
      this.showOutput(filename);
      this.setState({filename});
  }

  render() {
    const { Header, Content } = Layout;

    return (
      <Layout className="layout">
        <Header>
          <div className="title">Generated Data</div>
        </Header>
        <Content>
          <div id="chart"></div>
        </Content>
      </Layout>
    );
  }
}

export default DownloadCSV;
