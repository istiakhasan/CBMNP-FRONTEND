"use client";
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Radio,
  Tag,
  Progress,
  Input,
  Select,
} from "antd";
import {
  RiseOutlined,
  FallOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useGetAreaDistributionQuery } from "@/redux/api/dashboardApi";

interface AreaWiseAnalyticsProps {
  period?: string;
  startDate?: string;
  endDate?: string;
}

// Status list — statusColor ম্যাপিং সহ, UI-তে দেখাতে
const STATUS_OPTIONS = [
  { id: 1, label: "Pending", color: "default" },
  { id: 2, label: "Approved", color: "processing" },
  { id: 3, label: "Hold", color: "warning" },
  { id: 4, label: "Cancel", color: "error" },
  { id: 5, label: "Store", color: "default" },
  { id: 6, label: "Packing", color: "processing" },
  { id: 7, label: "In-transit", color: "processing" },
  { id: 8, label: "Delivered", color: "success" },
  { id: 9, label: "Unreachable", color: "error" },
  { id: 10, label: "Returned", color: "error" },
  { id: 11, label: "Pending-Return", color: "warning" },
  { id: 12, label: "Partial-Return", color: "warning" },
  { id: 13, label: "Damage", color: "error" },
];

export default function AreaWiseAnalytics({
  period = "month",
  startDate,
  endDate,
}: AreaWiseAnalyticsProps) {
  const [level, setLevel] = useState<"division" | "district" | "thana">("division");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]); // খালি = সব status

  const { data: areaRes, isLoading } = useGetAreaDistributionQuery({
    level,
    period,
    startDate,
    endDate,
    statusId: selectedStatuses.length > 0 ? selectedStatuses.join(",") : undefined,
  });

  const areaData = areaRes?.data;
  const areas: any[] = areaData?.areas || [];
  const topGrowing = areaData?.topGrowingAreas || [];
  const topDeclining = areaData?.topDecliningAreas || [];

  const filteredAreas = areas.filter((a) =>
    a.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topArea = areas[0];
  const topGrowingArea = topGrowing[0];
  const topDecliningArea = topDeclining[0];

  const chartAreas = areas.slice(0, 8);
  const chartOptions: any = {
    chart: { type: "bar", height: 320, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 4, barHeight: "60%", distributed: true },
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#6366F1", "#14B8A6"],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val} Orders`,
      style: { fontSize: "11px", fontWeight: "bold" },
    },
    xaxis: {
      categories: chartAreas.map((a) => a.area),
      labels: { formatter: (val: number) => `${val}` },
    },
    tooltip: {
      y: {
        formatter: (val: number, { dataPointIndex }: any) => {
          const item = chartAreas[dataPointIndex];
          return `${val} Orders (৳ ${Number(item?.sales || 0).toLocaleString()})`;
        },
      },
    },
    legend: { show: false },
  };

  const chartSeries = [{ name: "Orders", data: chartAreas.map((a) => a.orders) }];

  const columns: any = [
    {
      title: "Geographic Area",
      dataIndex: "area",
      key: "area",
      render: (area: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <EnvironmentOutlined />
          </div>
          <div>
            <span className="font-bold text-gray-800 block leading-tight">{area}</span>
            <span className="text-[11px] text-gray-400">
              {record.sharePercentage}% of total orders
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Order Volume",
      dataIndex: "orders",
      key: "orders",
      sorter: (a: any, b: any) => a.orders - b.orders,
      render: (orders: number, record: any) => (
        <div>
          <span className="font-bold text-gray-900 block">{orders} Orders</span>
          <Progress percent={record.sharePercentage} showInfo={false} size="small" strokeColor="#3B82F6" />
        </div>
      ),
    },
    {
      title: "Total Revenue (Tk)",
      dataIndex: "sales",
      key: "sales",
      sorter: (a: any, b: any) => a.sales - b.sales,
      render: (sales: number) => (
        <span className="font-bold text-emerald-700">৳ {Number(sales || 0).toLocaleString()}</span>
      ),
    },
    {
      title: "Delivery Success Rate",
      dataIndex: "deliveryRate",
      key: "deliveryRate",
      sorter: (a: any, b: any) => a.deliveryRate - b.deliveryRate,
      render: (rate: number, record: any) => (
        <div>
          <span className="font-semibold text-gray-700 text-xs block">
            {rate}% ({record.deliveredOrders} Delivered)
          </span>
          <Progress
            percent={rate}
            showInfo={false}
            size="small"
            status={rate >= 70 ? "success" : rate >= 50 ? "normal" : "exception"}
          />
        </div>
      ),
    },
    {
      title: "Period-over-Period Trend",
      dataIndex: "orderGrowthRate",
      key: "orderGrowthRate",
      sorter: (a: any, b: any) => a.orderGrowthRate - b.orderGrowthRate,
      render: (rate: number) => {
        if (rate > 0) {
          return (
            <Tag color="success" icon={<RiseOutlined />} className="font-bold">
              +{rate}% Growing
            </Tag>
          );
        } else if (rate < 0) {
          return (
            <Tag color="error" icon={<FallOutlined />} className="font-bold">
              {rate}% Declining
            </Tag>
          );
        }
        return <Tag color="default">Stable</Tag>;
      },
    },
  ];

  return (
    <Card className="shadow-sm border-gray-200 rounded-xl" loading={isLoading}>
      {/* Header with Level Switcher + Status Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shadow-inner">
            <CompassOutlined />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 m-0">
              Geographic & Area-Wise Order Analytics
            </h3>
            <p className="text-xs text-gray-500 m-0">
              Real-time regional order distribution, growth trends & drop-off detection
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by Status (All)"
            size="small"
            className="min-w-[220px]"
            value={selectedStatuses}
            onChange={(vals) => setSelectedStatuses(vals)}
            maxTagCount={2}
            options={STATUS_OPTIONS.map((s) => ({ value: s.id, label: s.label }))}
          />
          <Radio.Group
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="division">Division Wise</Radio.Button>
            <Radio.Button value="district">District Wise</Radio.Button>
            <Radio.Button value="thana">Thana / Upazila Wise</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* KPI Flash Cards */}
      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={8}>
          <Card size="small" className="bg-blue-50 border-blue-200 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase block mb-1">
                  Top Volume {level}
                </span>
                <span className="text-base font-extrabold text-blue-900 block">
                  {topArea?.area || "N/A"}
                </span>
                <span className="text-xs text-blue-700 font-medium mt-1 block">
                  {topArea?.orders || 0} Orders (৳ {Number(topArea?.sales || 0).toLocaleString()})
                </span>
              </div>
              <Tag color="blue">{topArea?.sharePercentage || 0}% Share</Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card size="small" className="bg-emerald-50 border-emerald-200 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase block mb-1">
                  Top Growing {level} 📈
                </span>
                <span className="text-base font-extrabold text-emerald-900 block">
                  {topGrowingArea?.area || "N/A"}
                </span>
                <span className="text-xs text-emerald-700 font-medium mt-1 block">
                  {topGrowingArea?.orders || 0} Orders (Prev: {topGrowingArea?.previousOrders || 0})
                </span>
              </div>
              {topGrowingArea ? (
                <Tag color="green" icon={<RiseOutlined />}>
                  +{topGrowingArea.orderGrowthRate}%
                </Tag>
              ) : (
                <Tag color="default">-</Tag>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card size="small" className="bg-rose-50 border-rose-200 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase block mb-1">
                  Declining Order Area Alert ⚠️
                </span>
                <span className="text-base font-extrabold text-rose-900 block">
                  {topDecliningArea?.area || "No Significant Drop"}
                </span>
                <span className="text-xs text-rose-700 font-medium mt-1 block">
                  {topDecliningArea
                    ? `${topDecliningArea.orders} Orders (Down from ${topDecliningArea.previousOrders})`
                    : "All regions stable or growing"}
                </span>
              </div>
              {topDecliningArea && (
                <Tag color="error" icon={<FallOutlined />}>
                  {topDecliningArea.orderGrowthRate}%
                </Tag>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Chart & Table Breakdown */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <div className="border border-gray-100 p-3 rounded-xl bg-gray-50/50 h-full">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Top 8 {level.toUpperCase()} Order Volume
            </span>
            {chartAreas.length > 0 ? (
              <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No geographic data for this period
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} lg={14}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Detailed Regional Breakdown ({areas.length} {level}s)
              </span>
              <Input
                placeholder={`Search ${level}...`}
                prefix={<SearchOutlined />}
                size="small"
                className="w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>
            <Table
              dataSource={filteredAreas}
              columns={columns}
              rowKey="area"
              size="small"
              pagination={{ pageSize: 6 }}
              scroll={{ x: 600 }}
              expandable={{
                expandedRowRender: (record: any) => (
                  <div className="flex flex-wrap gap-2 py-1">
                    {STATUS_OPTIONS.map((s) => {
                      const count = record.statusBreakdown?.[s.label] || 0;
                      if (count === 0) return null;
                      return (
                        <Tag key={s.id} color={s.color}>
                          {s.label}: {count}
                        </Tag>
                      );
                    })}
                  </div>
                ),
              }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}