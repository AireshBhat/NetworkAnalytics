import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#66bb6a', '#ef5350', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius } = props;
  let { percent } = props;
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) + 7;
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

class pieChart extends Component {
  render() {
    // console.log("helllooooooooooo");
    // console.log(this.props);
    return (
      <div>
        <Grid 
          container
          alignItems='center'
          justify='center'
          direction='column'
        >
          <Grid item >
            <PieChart width={250} height={200}>
              <Pie
                data={this.props.data}
                dataKey='value'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80} 
                fill="#8884d8"
                isAnimationActive={false}
                fillOpacity={0.9}
              >
                {
                  this.props.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                }
              </Pie>
            </PieChart>
          </Grid>
          <Grid item >
            <Tooltip id={this.props.device_name} title={this.props.device_isp}>
              <Typography variant={'body2'}>
                {this.props.device_name + ' - ' + this.props.device_region}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default pieChart;
