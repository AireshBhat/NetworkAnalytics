import React, { Component } from 'react';

import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

class barChart extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={this.props.data}>
          <CartesianGrid strokeDasharray={'3 3'}/>
          <XAxis dataKey="time"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='count' fill='#8884d8'/>
        </BarChart>
      </ResponsiveContainer>
    );
    };
};

export default barChart;
