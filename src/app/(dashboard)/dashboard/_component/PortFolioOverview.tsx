"use client"
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PortFolioOverview = () => {
    const data:any = {
        series: [{
          name: 'Total',
          data: [30,44, 30, 60, 56, 40, 65,60, 25, 70,30, 80]
        }
       
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
              columnWidth: '70%',
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
            categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec'],
          },
          fill: {
            opacity: 1,
            colors: ['#247574', '#946FFC', '#34C759','#FE8C4C']
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
              fillColors: ['#6835F9', '#946FFC', '#34C759','#FE8C4C'],
            }
          }
        },
      };
    return (
        <div>
             <ReactApexChart options={data.options} series={data.series} type="bar" height={450} />
        </div>
    );
};

export default PortFolioOverview;