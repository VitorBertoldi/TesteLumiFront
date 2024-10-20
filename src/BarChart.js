import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, labels, title }) => {
  const chartData = {
    labels: labels || [],  
    datasets: [
      {
        label: title || 'Valores Financeiros',
        data: data.map(value => Math.abs(value)),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(75, 255, 75, 0.6)'],
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        left: 20,  
        right: 20,
        top: 20,
        bottom: 20,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
    <h2>{title}</h2> {}
    <div style={{ padding: '20px', width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  </>
  );
};

export default BarChart;
