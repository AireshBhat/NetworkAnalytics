import React, { Component } from 'react';

import { 
  LineChart, 
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  } from 'recharts';

import Divider from '@material-ui/core/Divider';

import moment from 'moment';

class lineChart extends Component {
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
    const LineList = this.props.data.map(item => {
      console.log(item);
      return (
        <div>
          <ResponsiveContainer width="100%" height={200} key={item.device_name}>
            <LineChart
              data={item.device_data}
              margin={{ top: 0, right: 0, left: 0, bottom: 10 }}
              width={400}
              height={300}
              syncId="UD"
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis 
                dataKey='event_start_time' 
                type={'number'} 
                domain={['auto', 'auto']} 
                tickFormatter={this.xAxisTickFormatter}
              />
              <YAxis 
                label={{ value: "State", angle: -90,}}
                tickFormatter={this.yAxisTickFormatter}
              />
              <Tooltip />
              <Legend />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={0.5} stopColor="green" stopOpacity={1}/>
                  <stop offset={0.5} stopColor="red" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Line 
                dataKey='event_state' 
                name={item.device_name}
                baseLine={-10}
                type='step'
                stroke="url(#splitColor)"
              />
            </LineChart>
            </ResponsiveContainer>
            <Divider />
        </div>
      );
    });
    return (
      <div>
        {LineList}
      </div>
    );
  };
};

export default lineChart;


