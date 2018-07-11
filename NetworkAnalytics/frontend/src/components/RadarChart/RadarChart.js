import React, { Component } from 'react';

import {
  RadarChart,
  Radar,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';

class radarChart extends Component{
	render () {
  	return (
      <RadarChart 
        outerRadius={75} 
        width={400} 
        height={300} 
        data={this.props.data}
        margin={ {top: 50, bottom: 50,} }
      >
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis/>
          <Legend />
          <Tooltip />
          <Radar name="Up Time Comparison" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
    );
  }
};

export default radarChart;
