import React, { Component } from 'react';

import { 
  LineChart, 
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

import moment from 'moment';

class lineChart extends Component {
  componentDidMount() {
    console.log(this.props);
  };

  xAxisTickFormatter = date => {
    return moment.unix(date).format('DD-MM, HH:mm');
  }

  yAxisTickFormatter = val => {
    if(val === 50){
      return '';
    }
    return (val + 'ms');
  };

  render () {
    return (
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={this.props.data}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <ReferenceLine y={40} stroke='yellow' label="40ms" />
          <ReferenceLine y={120} stroke='violet' label="120ms" />
          <ReferenceLine y={200} stroke='red' label="200ms" />
          <XAxis 
            dataKey='event_start_time'
            type={'number'}
            domain={['auto', 'auto']}
            tickFormatter={this.xAxisTickFormatter}
            label={{value: 'Date', marginTop: 20, position: 'insideBottom',offset: -5}}
          />
          <YAxis 
            label={{ value: "Latency", angle: -90,}}
            tickFormatter={this.yAxisTickFormatter}
          />
          <Tooltip />
          <Line
            dataKey='device_rta'
            baseline={-10}
            type='monotone'
            stroke="#000"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
};

export default lineChart;

