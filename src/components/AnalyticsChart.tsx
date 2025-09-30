import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLogStore } from '../store/useLogStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart: React.FC = () => {
  const analytics = useLogStore((state) => state.analytics);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Log Analytics Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: analytics.timestamps || [],
    datasets: [
      {
        label: 'Errors',
        data: analytics.errors || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        label: 'Warnings',
        data: analytics.warnings || [],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.5)',
      },
      {
        label: 'Info',
        data: analytics.info || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  return (
    <Paper className="p-4 h-full">
      <Typography variant="h6" className="mb-4">
        Analytics Dashboard
      </Typography>
      <div className="h-80">
        <Line options={options} data={data} />
      </div>
    </Paper>
  );
};

export default AnalyticsChart;
