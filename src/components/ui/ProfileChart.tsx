"use client"
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [chartData, setChartData] = useState<any>({
    series: [{
      name: 'series1',
      data: [50, 55, 52, 60, 50, 55, 45, 60]
    }],
    options: {
      chart: {
        height: 200,
        type: "area",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        crosshairs: {
          show: true,
          width: 1, 
          stroke: {
              opacity: 1, 
            color: '#3E30D5', 
            width: 2, 
            dashArray: 0
          },
          fill: {
            color: '#3E30D5', 
            width:2,
          }
        }
      },
      yaxis: {
        show: false
      },
      grid: {
        show: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#3E30D5'],
        marker:{
            colors:["#000000"]
        }
      },
      fill: {
        type: 'solid',
        colors: ['#DCDAFB']
      },
      tooltip: {
        enabled: true,
        fillColors: ['#3E30D5'],
        marker: {
          show: true,
          fillColors: ['#3E30D5'],
          colors:["#000000"]
        },
        x: {
          show: true,
          format: 'MMM',
          formatter: undefined,
        },
      },
      markers: {
        colors: ["#3E30D5"],
        strokeColor: "#3E30D5",
        strokeWidth: 3
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" height={200} />
    </div>
  );
};

export default ApexChart;
