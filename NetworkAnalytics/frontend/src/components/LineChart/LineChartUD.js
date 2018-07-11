import React, { Component } from 'react';

import { 
  LineChart, 
  // Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import moment from 'moment';

import TooltipContent from '../Tooltip/Tooltip';

// const TooltipContent = (props) => {
//   console.log("tooltip");
//   console.log(props);
//   return (
//     <Paper>
//       <Typography variant="subheading">
//         Date: {moment.unix(props.label).format('DD-MM, HH:mm')}
//       </Typography>
//     </Paper>
//   );
// };

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
    return (
      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={this.props.data}
          margin={{ top: 0, right: 0, left: 0, bottom: 10 }}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3"/>
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
          <Tooltip 
            content={(data) => 
              <TooltipContent 
                data={data}
                ud
              />
            }
          />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={0.5} stopColor="green" stopOpacity={1}/>
              <stop offset={0.5} stopColor="red" stopOpacity={1}/>
            </linearGradient>
          </defs>
          {this.props.children}
        </LineChart>
      </ResponsiveContainer>
    );
  };
};

export default lineChart;

