import React, { Component } from 'react';

import {
  RadarChart,
  Radar,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  LabelList,
} from 'recharts';

class radarChart extends Component{
	render () {
  	return (
      <RadarChart 
        outerRadius={125} 
        width={500} 
        height={500} 
        data={this.props.data}
        margin={ {top: 50, bottom: 50,} }
      >
          <PolarGrid />
          <PolarAngleAxis dataKey="name" radius='200%' />
          <PolarRadiusAxis/>
          <Legend margin={{right: 80, left: 80, top: 80, bottom: 80}}/>
          <Tooltip />
          <Radar 
            name={this.props.name} 
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8" 
            fillOpacity={0.6}
            legendType={'square'}
            isAnimationActive={false}
          >
            <LabelList dataKey="value" position='insideStart' angle="0"/>
          </Radar>
        </RadarChart>
    );
  }
};

export default radarChart;
