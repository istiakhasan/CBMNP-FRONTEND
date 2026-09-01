"use client";
import React, { useState } from "react";
import {
  Card,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Spin,
  Table,
} from "antd";
import {
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetProfitAndLossQuery } from "@/redux/api/accountingApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { RangePicker } = DatePicker;

export default function ProfitAndLossPage() {
  const currentYear = dayjs().year();
  const [startDate, setStartDate] = useState<string>(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const { data, isLoading, refetch } = useGetProfitAndLossQuery({
    startDate,
    endDate,
  });

  const report = data?.data;

  const itemColumns: any = [
    {
      title: "Account Code",
      dataIndex: "accountCode",
      key: "accountCode",
      width: "20%",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      width: "50%",
    },
    {
      title: "Amount (Tk)",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      width: "30%",
      render: (val: number) => (
        <span className="font-medium">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  const totalRevenue = Number(report?.totalRevenue || 0);
  const totalCOGS = Number(report?.totalCostOfSales || 0);
  const grossProfit = Number(report?.grossProfit || 0);
  const totalExpenses = Number(report?.totalOperatingExpenses || 0);
  const netProfit = Number(report?.netProfit || 0);
  const grossMargin =
    totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : "0.0";
  const netMargin = report?.netMarginPercentage || "0.0";

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Profit & Loss Statement (Income Statement)" />

      {/* Filter Toolbar */}
      <Card size="small" className="shadow-sm">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <Space align="center" wrap>
              <span className="text-gray-600 font-medium">Reporting Period:</span>
              <RangePicker
                value={[dayjs(startDate), dayjs(endDate)]}
                onChange={(dates, dateStrings) => {
                  if (dateStrings[0] && dateStrings[1]) {
                    setStartDate(dateStrings[0]);
                    setEndDate(dateStrings[1]);
                  }
                }}
              />
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic
              title="Gross Profit"
              value={grossProfit}
              precision={2}
              valueStyle={{ color: "#1890ff" }}
              suffix={`Tk (${grossMargin}%)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-orange-500 shadow-sm">
            <Statistic
              title="Operating Expenses"
              value={totalExpenses}
              precision={2}
              valueStyle={{ color: "#fa8c16" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            className={`border-l-4 ${
              netProfit >= 0 ? "border-emerald-600" : "border-rose-600"
            } shadow-sm`}
          >
            <Statistic
              title="Net Profit / (Loss)"
              value={netProfit}
              precision={2}
              valueStyle={{ color: netProfit >= 0 ? "#237804" : "#cf1322" }}
              prefix={netProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix={`Tk (${netMargin}%)`}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Multi-Step P&L Statement */}
      <Card className="shadow-sm rounded-lg">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* 1. Operating Revenue Section */}
            <div>
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-t-lg border-b border-emerald-200">
                <span className="font-bold text-base text-emerald-900">
                  1. Operating Revenue & Income
                </span>
                <span className="font-bold text-base text-emerald-800">
                  {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk
                </span>
              </div>
              <Table
                columns={itemColumns}
                dataSource={report?.revenues || []}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>

            {/* 2. Cost of Sales Section */}
            <div>
              <div className="flex justify-between items-center bg-amber-50 p-3 rounded-t-lg border-b border-amber-200">
                <span className="font-bold text-base text-amber-900">
                  2. Cost of Goods Sold (COGS)
                </span>
                <span className="font-bold text-base text-amber-800">
                  ({totalCOGS.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk)
                </span>
              </div>
              <Table
                columns={itemColumns}
                dataSource={report?.costOfSales || []}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>

            {/* Gross Profit Subtotal */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200 font-bold text-lg">
              <span className="text-blue-900">GROSS PROFIT</span>
              <span className="text-blue-800">
                {grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk
              </span>
            </div>

            {/* 3. Operating Expenses Section */}
            <div>
              <div className="flex justify-between items-center bg-rose-50 p-3 rounded-t-lg border-b border-rose-200">
                <span className="font-bold text-base text-rose-900">
                  3. Operating & Administrative Expenses
                </span>
                <span className="font-bold text-base text-rose-800">
                  ({totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk)
                </span>
              </div>
              <Table
                columns={itemColumns}
                dataSource={report?.operatingExpenses || []}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>

            <Divider />

            {/* Final Net Profit Banner */}
            <div
              className={`p-5 rounded-xl border flex justify-between items-center font-bold text-xl ${
                netProfit >= 0
                  ? "bg-emerald-100 border-emerald-300 text-emerald-950"
                  : "bg-rose-100 border-rose-300 text-rose-950"
              }`}
            >
              <div>
                <span>NET PROFIT / (NET LOSS)</span>
                <span className="block text-xs font-normal text-gray-600 mt-1">
                  Gross Profit ({grossProfit.toLocaleString()}) minus Total Operating Expenses (
                  {totalExpenses.toLocaleString()})
                </span>
              </div>
              <span className="text-2xl">
                {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} Tk
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
