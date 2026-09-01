"use client";
import { useGetMonthlySalesReportQuery } from "@/redux/api/dashboardApi";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PortFolioOverviewProps {
  chartData?: Array<{ key: string; revenue: number; orders?: number }>;
  periodTitle?: string;
}

const DEFAULT_CATEGORIES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const PortFolioOverview: React.FC<PortFolioOverviewProps> = ({
  chartData,
  periodTitle = "Revenue & Sales Trend",
}) => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [seriesData, setSeriesData] = useState<number[]>(new Array(12).fill(0));
  const { data: queryData, isLoading } = useGetMonthlySalesReportQuery(undefined);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setCategories(chartData.map((d) => d.key || ""));
      setSeriesData(chartData.map((d) => Number(d.revenue || 0)));
    } else if (queryData?.series?.[0]?.data) {
      setCategories(DEFAULT_CATEGORIES);
      setSeriesData(queryData.series[0].data.map((v: any) => Number(v || 0)));
    }
  }, [chartData, queryData]);

  if (!chartData && isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Loading sales trend...
      </div>
    );
  }

  const safeData = seriesData.length === categories.length
    ? seriesData
    : categories.map((_, i) => seriesData[i] || 0);

  const data: any = {
    series: [
      {
        name: "Revenue (Tk)",
        data: safeData,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 320,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
        colors: ["#2563EB"],
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return "৳ " + Number(val || 0).toLocaleString();
          },
        },
      },
      legend: {
        show: false,
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-base font-bold text-gray-800 m-0">{periodTitle}</h4>
      </div>
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default PortFolioOverview;