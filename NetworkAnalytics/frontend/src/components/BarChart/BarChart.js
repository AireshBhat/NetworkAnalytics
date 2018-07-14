import React, { Component } from 'react';

import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

class barChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={this.props.data}>
          <CartesianGrid strokeDasharray={'3 3'}/>
          <XAxis dataKey="time"/>
          <YAxis padding={{ top: 30}}/>
          <Tooltip />
          <Legend />
          <Bar name={this.props.device_name} dataKey='count' fill='#8884d8' isAnimationActive={false} stroke='#8884d8' opacity={0.8} label >
            <LabelList dataKey="timeCount" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
    };
};

export default barChart;
