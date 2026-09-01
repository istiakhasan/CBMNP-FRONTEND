"use client";

import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { usePartnerDistributionQuery } from "@/redux/api/dashboardApi";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
interface OrderDataItem {
  label: string;
  count: string;
}

const DeliveryPartner: React.FC = () => {
  const { data: statusDistribution, isLoading } =
    usePartnerDistributionQuery(undefined);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: "donut",
    },
    labels: [],
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val.toFixed(1)}%`;
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val} orders`;
        },
      },
    },
    legend: {
      show:true,
      position: "bottom",
      formatter: function (seriesName: string, opts: any) {
        const raw = opts?.w?.globals?.seriesPercent?.[opts.seriesIndex];
        const percent = Number(raw) || 0;
        return `${seriesName}: ${percent.toFixed(1)}%`;
      },
    },
    colors: ['#4CAF50', '#009688', '#00BCD4'],

    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: false,
              label: "Total",
              formatter: function (w: any) {
                const totals = w?.globals?.seriesTotals;
                if (!totals || !Array.isArray(totals) || totals.length === 0) return "0";
                return totals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toLocaleString();
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  useEffect(() => {
    if (statusDistribution?.data && !isLoading) {
      const filtered = statusDistribution.data.filter(
        (item: OrderDataItem) => item.label !== "All"
      );
      const chartLabels = filtered.map((item: OrderDataItem) => item.label);
      const chartSeries = filtered.map((item: OrderDataItem) =>
        parseInt(item.count, 10) || 0
      );

      setLabels(chartLabels);
      setSeries(chartSeries);

      setOptions((prev) => ({
        ...prev,
        labels: chartLabels,
      }));
    }
  }, [statusDistribution, isLoading]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Loading delivery partners...
      </div>
    );
  }

  if (!series || series.length === 0) {
    return (
      <div>
        <h1 className="text-[16px] font-bold leading-none mb-4">Delivery Partners</h1>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          No courier partner data available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[16px] font-bold leading-none">Delivery Partners</h1>
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        height={350}
      />
    </div>
  );
};

export default DeliveryPartner;
