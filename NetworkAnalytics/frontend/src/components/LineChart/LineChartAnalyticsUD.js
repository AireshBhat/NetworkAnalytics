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
import { withStyles } from '@material-ui/core/styles';

import TooltipContent from '../Tooltip/Tooltip';

import moment from 'moment';

const styles = theme => ({
  unit: {
    marginBottom: theme.spacing.unit,
  }
});

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
    const { classes } = this.props;
    const LineList = this.props.data.map(item => {
      return (
        <div key={item.device_name} className={classes.unit}>
          <ResponsiveContainer width="100%" height={200} >
            <LineChart
              data={
                item.device_data.map(item => {
                  if(item.event_start_time >= this.props.event_start_date_unix && item.event_end_time <= this.props.event_end_date_unix){
                    return {
                      ...item,
                    }
                  }
                  return null;
                })
              }
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
              <Tooltip 
                content={
                  (data) => <TooltipContent ud data={data}/>
                }
              />
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
            <Divider/>
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

export default withStyles(styles)(lineChart);


