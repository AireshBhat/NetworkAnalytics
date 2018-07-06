import React, { Component } from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
      {month: '2015.01', a: 4000, b: 2400, c: 2400},
      {month: '2015.02', a: 3000, b: 1398, c: 2210},
      {month: '2015.03', a: 2000, b: 9800, c: 2290},
      {month: '2015.04', a: 2780, b: 3908, c: 2000},
      {month: '2015.05', a: 1890, b: 4800, c: 2181},
      {month: '2015.06', a: 2390, b: 3800, c: 2500},
      {month: '2015.07', a: 3490, b: 4300, c: 2100},
];

class AreaChartGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            device: props.device,
            device_data: props.device_data
        }
        // console.log("props.item: ");
        // console.log(props.device_data);
    };
    render() {
        return (
            <AreaChart width={500} height={400} data={data}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Area type='monotone' dataKey='a' stackId="1" stroke='#8884d8' fill='#8884d8' />
            </AreaChart>
        );
    };
};

export default AreaChartGraph;
