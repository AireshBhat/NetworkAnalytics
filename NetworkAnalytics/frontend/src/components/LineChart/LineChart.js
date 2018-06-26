import React, { Component } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
      {month: '2015.01', a: 4000, b: 2400, c: 2400},
      {month: '2015.02', a: 3000, b: 1398, c: 2210},
      {month: '2015.03', a: 2000, b: 9800, c: 2290},
      {month: '2015.04', a: 2780, b: 3908, c: 2000},
      {month: '2015.05', a: 1890, b: 4800, c: 2181},
      {month: '2015.06', a: 2390, b: 3800, c: 2500},
      {month: '2015.07', a: 3490, b: 4300, c: 2100},
];

class LineChartGraph extends Component {
    render() {
        return (
            <LineChart width={400} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Line type="monotone" dataKey="b" stroke="#8884d8" />
            </LineChart>
        );
    };
};

export default LineChartGraph;
