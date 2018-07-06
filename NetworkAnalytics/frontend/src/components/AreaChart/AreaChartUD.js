import React, { Component } from 'react';

import { 
  AreaChart, 
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  } from 'recharts';

import moment from 'moment';

class areaChart extends Component {
  componentDidMount() {
  };

  xAxisTickFormatter = date => {
    return moment.unix(date).format('DD-MM, HH:mm');
  };

  yAxisTickFormatter = val => {
    if(val === 1){
      return 'UP';
    }
    else if(val === -1){
      return 'DOWN';
    }
    else {
      return '';
    }
  };

  render () {
    return (
      <ResponsiveContainer width="100%" height={450}>
        <AreaChart
          data={this.props.data}
          margin={{ top: 0, right: 0, left: 0, bottom: 10 }}
          height={300}
        >
          <CartesianGrid strokeDasharray="5 5"/>
          <XAxis 
            dataKey='event_start_time' 
            type={'number'} 
            domain={['auto', 'auto']} 
            tickFormatter={this.xAxisTickFormatter}
            minTickGap={3}
            label={{ value: "Date", marginTop: 20, position: 'insideBottom', offset: -5}}
          />
          <YAxis 
            minTickGap={10}
            label={{ value: "State", angle: -90,}}
            tickFormatter={this.yAxisTickFormatter}
          />
          <Tooltip />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0.5} stopColor="green" stopOpacity={1}/>
              <stop offset={0.5} stopColor="red" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <Area 
            dataKey='event_state' 
            baseLine={-10}
            type='step'
            stroke="#000"
            fill="url(#splitColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
};

export default areaChart;
