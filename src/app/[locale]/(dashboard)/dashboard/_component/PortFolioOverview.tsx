"use client"
import { useGetMonthlySalesReportQuery } from '@/redux/api/dashboardApi';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const PortFolioOverview = () => {
const [seriesData, setSeriesData] = useState<number[]>([]);
  const {data:queryData,isLoading}=useGetMonthlySalesReportQuery(undefined)

 const data:any = {
        series: [{
          name: 'Total',
          data: seriesData
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
            colors: ['#4F8A6D', '#946FFC', '#34C759','#FE8C4C']
          },
          tooltip: {
            y: {
              formatter: function (val:any) {
                return "৳" + val 
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

  useEffect(() => {
   if(!!queryData){
    console.log(queryData);
   setSeriesData(queryData?.series[0]?.data);
   }
  }, [queryData]);
   
      if(isLoading){
        return
      }
      console.log(seriesData,"series data");
    return (
        <div>
             <ReactApexChart options={data.options} series={data?.series} type="bar" height={350} />
        </div>
    );
};

export default PortFolioOverview;