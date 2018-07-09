import React, { Component } from 'react';

import { 
  LineChart, 
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';

import Divider from '@material-ui/core/Divider';

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
    const latItems = this.props.data.map(item => {
    return(
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={item.device_data.map((item) => {
              if(item.device_rta === 0){
                return {
                  event_start_time: item.event_start_time,
                  event_end_time: item.event_end_time,
                  device_ping: item.device_ping,
                };
              }
              return {
                ...item
              };
            })
            }
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
            />
          <YAxis 
            label={{ value: "Latency", angle: -90,}}
            tickFormatter={this.yAxisTickFormatter}
          />
          <Tooltip />
          <Legend />
          <Line
            dataKey='device_rta'
            name={item.device_name}
            baseline={-10}
            type='monotone'
            stroke="#000"
          />
          </LineChart>
          </ResponsiveContainer>
          <Divider />
      </div>
    )
      
    })
    return (
      <div>
        {latItems}
      </div>
    );
  };
};

export default lineChart;


