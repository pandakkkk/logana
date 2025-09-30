import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

type ChartProps = { data: Array<{ timestamp: string; count: number }> }

const AnalyticsChart: React.FC<ChartProps> = ({ data }) => (
  <LineChart width={600} height={300} data={data}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="timestamp" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="count" stroke="#8884d8" />
  </LineChart>
);

export default AnalyticsChart
