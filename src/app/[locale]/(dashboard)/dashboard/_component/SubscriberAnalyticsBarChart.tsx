"use client"
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SubscriberAnalyticsBarChart = () => {
    const data:any = {
        series: [{
          name: 'Total',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Active',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, 
        {
          name: 'New',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        },
        {
          name: 'Expired',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        },
    ],
        options: {
          chart: {
            type: 'bar',
            height: 370,
            toolbar: {
                show: false
              }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          },
          fill: {
            opacity: 1,
            colors: ['#6835F9', '#946FFC', '#34C759','#FE8C4C']
          },
          tooltip: {
            y: {
              formatter: function (val:any) {
                return "$ " + val + " thousands"
              }
            }
          },
          legend: {
            markers: {
              fillColors: ['#6835F9', '#946FFC', '#34C759','#FE8C4C'], // Custom colors for the legend markers
            }
          }
        },
      };
    return (
        <div>
            <ReactApexChart options={data.options} series={data.series} type="bar" height={350} />
        </div>
    );
};

export default SubscriberAnalyticsBarChart;
