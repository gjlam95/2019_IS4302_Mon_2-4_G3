import React, { Component } from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import { Layout } from 'antd';


function createGraph(data) {
  	var years = [];
  	var silverMinted = ["Silver Minted"];

  	for (var i = 1; i < data.length; i++) {
        if (data[i][0] !== undefined && data[i][0] !== null
            && data[i][2] !== undefined && data[i][2] !== null) {
            years.push(data[i][0]);
            silverMinted.push(data[i][2]);
        } else {
            years.push(0);
            silverMinted.push(0);
        }
  	}

  	var chart = c3.generate({
        bindto: '#chart',
  	    data: {
  	        columns: [
  	        	silverMinted
  	        ]
  	    },
  	    axis: {
  	        x: {
  	            type: 'category',
  	            categories: years,
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

function parseData() {
    var csvFilePath = require("../sample-data/sample.csv");
    var Papa = require("papaparse/papaparse.min.js");
	  Papa.parse(csvFilePath, {
		    download: true,
		    complete: function(results) {
			       createGraph(results.data);
		    }
	  });
}

class Chart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // results: [],
        };
    }

    render() {
      const { Header, Content } = Layout;
      parseData();
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

export default Chart;
