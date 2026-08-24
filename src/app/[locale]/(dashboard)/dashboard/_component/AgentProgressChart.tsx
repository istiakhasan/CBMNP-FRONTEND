"use client";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Props {
  data: any[];
  xKey: string;
  compact?: boolean;
}

const AgentProgressChart = ({ data, xKey, compact }: Props) => {
  const categories = data.map((d) => d[xKey]);
  const orders = data.map((d) => d.orders);
  const revenue = data.map((d) => d.revenue);

  const options: any = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    stroke: {
      width: [3, 3],
      curve: "smooth",
    },
    colors: ["#2563EB", "#4F8A6D"],
    markers: {
      size: 4,
      strokeWidth: 0,
    },
    xaxis: {
      categories,
      labels: {
        style: { fontSize: "11px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: "Orders", style: { fontSize: "11px" } },
        labels: { style: { fontSize: "11px" } },
      },
      {
        opposite: true,
        title: { text: "Revenue (৳)", style: { fontSize: "11px" } },
        labels: { style: { fontSize: "11px" } },
      },
    ],
    grid: {
      borderColor: "#f0f0f0",
      strokeDashArray: 3,
    },
    legend: {
      position: "top",
      fontSize: "12px",
    },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    { name: "Orders", data: orders },
    { name: "Revenue (৳)", data: revenue },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={compact ? 220 : 280}
    />
  );
};

export default AgentProgressChart;