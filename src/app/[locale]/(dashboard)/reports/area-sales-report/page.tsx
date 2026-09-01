"use client";
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Tag,
  Statistic,
  Input,
  Space,
  Radio,
  Progress,
  DatePicker,
} from "antd";
import {
  CompassOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  RiseOutlined,
  FallOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetAreaDistributionQuery } from "@/redux/api/dashboardApi";

const { RangePicker } = DatePicker;

export default function AreaSalesReport() {
  const local = useLocale();
  const [level, setLevel] = useState<"division" | "district" | "thana">("division");
  const [period, setPeriod] = useState<string>("month");
  const [dateRange, setDateRange] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams: any = {
    level,
    period,
  };
  if (dateRange && dateRange[0] && dateRange[1]) {
    queryParams.startDate = dateRange[0].format("YYYY-MM-DD");
    queryParams.endDate = dateRange[1].format("YYYY-MM-DD");
  }

  const { data: areaRes, isLoading } = useGetAreaDistributionQuery(queryParams);
  const areaData = areaRes?.data || {};
  const areas: any[] = areaData?.areas || [];

  const totalOrders = areas.reduce((s, a) => s + Number(a.orders || 0), 0);
  const totalSales = areas.reduce((s, a) => s + Number(a.sales || 0), 0);
  const totalDelivered = areas.reduce((s, a) => s + Number(a.deliveredOrders || 0), 0);
  const avgDeliveryRate = totalOrders > 0 ? ((totalDelivered / totalOrders) * 100).toFixed(1) : 0;

  const filteredAreas = areas.filter((a: any) =>
    a.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: any = [
    {
      title: "Geographic Location",
      dataIndex: "area",
      key: "area",
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <EnvironmentOutlined />
          </div>
          <div>
            <span className="font-bold text-gray-800 block">{name}</span>
            <span className="text-xs text-gray-400">{record.sharePercentage}% Market Share</span>
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
          <Progress
            percent={record.sharePercentage}
            showInfo={false}
            size="small"
            strokeColor="#3B82F6"
          />
        </div>
      ),
    },
    {
      title: "Gross Sales (Tk)",
      dataIndex: "sales",
      key: "sales",
      sorter: (a: any, b: any) => a.sales - b.sales,
      render: (sales: number) => (
        <span className="font-extrabold text-emerald-700">
          ৳ {Number(sales || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Delivered Units",
      dataIndex: "deliveredOrders",
      key: "deliveredOrders",
      render: (c: number) => `${c} Delivered`,
    },
    {
      title: "Delivery Success Rate",
      dataIndex: "deliveryRate",
      key: "deliveryRate",
      sorter: (a: any, b: any) => a.deliveryRate - b.deliveryRate,
      render: (rate: number) => (
        <div>
          <span className="font-semibold text-gray-700 text-xs block">{rate}%</span>
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
      title: "Growth Trend",
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
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Geographic & Regional Area-Wise Sales Report" />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Regional & Area-Wise Sales Intelligence
            </h2>
          </Space>
          <Space>
            <Radio.Group
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="division">Divisions</Radio.Button>
              <Radio.Button value="district">Districts</Radio.Button>
              <Radio.Button value="thana">Thana / Upazila</Radio.Button>
            </Radio.Group>
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Statement
            </Button>
          </Space>
        </div>

        {/* KPI Flash Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Regional Orders"
                value={totalOrders}
                valueStyle={{ fontWeight: 800, color: "#1e3a8a" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Across {areas.length} {level} regions
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-emerald-50/40">
              <Statistic
                title="Total Regional Revenue"
                value={totalSales}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#059669" }}
              />
              <span className="text-xs text-emerald-700 mt-1 block">
                Gross GMV generated
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-blue-50/40">
              <Statistic
                title="Delivered Orders"
                value={totalDelivered}
                valueStyle={{ fontWeight: 800, color: "#2563eb" }}
              />
              <span className="text-xs text-blue-700 mt-1 block">
                Avg delivery rate: {avgDeliveryRate}%
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-purple-50/40">
              <Statistic
                title="Top Region"
                value={areas[0]?.area || "N/A"}
                valueStyle={{ fontWeight: 700, fontSize: 18, color: "#6b21a8" }}
              />
              <span className="text-xs text-purple-700 mt-1 block">
                {areas[0]?.orders || 0} Orders ({areas[0]?.sharePercentage || 0}% share)
              </span>
            </Card>
          </Col>
        </Row>

        {/* Table View */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Detailed Regional Performance Ledger ({filteredAreas.length} {level}s)
            </span>
            <Input
              placeholder={`Search by ${level} name...`}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredAreas}
            columns={columns}
            rowKey="area"
            loading={isLoading}
            pagination={{ pageSize: 12 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
}
