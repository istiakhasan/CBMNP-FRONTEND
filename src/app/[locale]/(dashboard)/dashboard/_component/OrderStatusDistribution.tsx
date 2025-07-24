"use client";

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useStatusDistributionQuery } from "@/redux/api/dashboardApi";

interface OrderDataItem {
  label: string;
  count: string;
}

const DonutChart: React.FC = () => {
  const { data: statusDistribution, isLoading } =
    useStatusDistributionQuery(undefined);
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
      position: "right",
      formatter: function (seriesName: string, opts: any) {
        const raw = opts?.w?.globals?.seriesPercent?.[opts.seriesIndex];
        const percent = Number(raw) || 0;
        return `${seriesName}: ${percent.toFixed(1)}%`;
      },
    },
    colors: [], // Will be set dynamically
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
              show: true,
              label: "Total",
              formatter: function (w: any) {
                return w.globals.seriesTotals
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

  // Status-wise color mapping
  const statusColorMap: Record<string, string> = {
    Approved: "#4CAF50",
    Pending: "#FFC107",
    Delivered: "#009688",
    Cancel: "#F44336",
    Processing: "#9C27B0",
    Shipped: "#00BCD4",
    Returned: "#D7263D",
    Confirmed: "#FF9800",
    Store: "#FF9800",
    Hold: "#9C27B0",
    Packing: "#3F51B5",
    ["In-transit"]: "#00BCD4",
    // Add more status-color pairs as needed
  };

  useEffect(() => {
    if (statusDistribution?.data && !isLoading) {
      const filtered = statusDistribution.data.filter(
        (item: OrderDataItem) => item.label !== "All"
      );

      const chartLabels = filtered.map((item: OrderDataItem) => item.label);
      const chartSeries = filtered.map((item: OrderDataItem) =>
        parseInt(item.count, 10)
      );
      const chartColors = chartLabels.map(
        (label:any) => statusColorMap[label] || "#CCCCCC" // fallback color
      );

      setLabels(chartLabels);
      setSeries(chartSeries);

      setOptions((prev) => ({
        ...prev,
        labels: chartLabels,
        colors: chartColors,
      }));
    }
  }, [statusDistribution, isLoading]);

  if (isLoading) {
    return <p>Loading chart...</p>;
  }

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default DonutChart;
