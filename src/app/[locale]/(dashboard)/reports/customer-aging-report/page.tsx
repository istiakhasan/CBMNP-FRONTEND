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
  Progress,
} from "antd";
import {
  DollarOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetCustomerAgingReportQuery } from "@/redux/api/financeApi";

export default function CustomerAgingReport() {
  const local = useLocale();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: agingRes, isLoading } = useGetCustomerAgingReportQuery(undefined);
  const agingData = agingRes?.data || {};
  const customers: any[] = agingData?.customers || [];
  const totals = agingData?.totals || {
    totalOutstanding: 0,
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days61to90: 0,
    days90Plus: 0,
  };

  const filteredCustomers = customers.filter(
    (c: any) =>
      c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: any = [
    {
      title: "Customer Name & Phone",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <UserOutlined />
          </div>
          <div>
            <span className="font-bold text-gray-800 block">{name}</span>
            <span className="text-xs text-gray-400">{record.phoneNumber || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Credit Limit (Tk)",
      dataIndex: "creditLimit",
      key: "creditLimit",
      render: (limit: number) => `৳ ${Number(limit || 0).toLocaleString()}`,
    },
    {
      title: "Total Due (Tk)",
      dataIndex: "totalDue",
      key: "totalDue",
      sorter: (a: any, b: any) => a.totalDue - b.totalDue,
      render: (due: number) => (
        <span className="font-bold text-rose-700">
          ৳ ${Number(due || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Current (0-30 Days)",
      dataIndex: "current",
      key: "current",
      render: (v: number) => (
        <span className="text-emerald-700 font-semibold">
          ৳ {Number(v || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "31-60 Days Overdue",
      dataIndex: "days31to60",
      key: "days31to60",
      render: (v: number) => (
        <span className="text-amber-700 font-semibold">
          ৳ {Number(v || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "61-90 Days Overdue",
      dataIndex: "days61to90",
      key: "days61to90",
      render: (v: number) => (
        <span className="text-orange-700 font-semibold">
          ৳ {Number(v || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "90+ Days Critical",
      dataIndex: "days90Plus",
      key: "days90Plus",
      render: (v: number) => (
        <span className="text-rose-700 font-extrabold">
          ৳ {Number(v || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Risk Status",
      key: "risk",
      render: (_: any, record: any) => {
        if (record.days90Plus > 0) return <Tag color="error">Critical Default</Tag>;
        if (record.days61to90 > 0) return <Tag color="warning">High Overdue</Tag>;
        if (record.totalDue > 0) return <Tag color="blue">Active Invoices</Tag>;
        return <Tag color="success">Paid Up</Tag>;
      },
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Customer Accounts Receivable (AR) Aging Report" />
      <div className="p-4 md:p-6 space-y-6  mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Customer Accounts Receivable (AR) Aging
            </h2>
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Statement
            </Button>
          </Space>
        </div>

        {/* KPI Flash Summary */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Outstanding AR"
                value={totals.totalOutstanding}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#1e3a8a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-emerald-50/40">
              <Statistic
                title="Current (0-30 Days)"
                value={totals.current}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#059669" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-blue-50/40">
              <Statistic
                title="1-30 Days Past"
                value={totals.days1to30}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#2563eb" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-amber-50/40">
              <Statistic
                title="31-60 Days Past"
                value={totals.days31to60}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#d97706" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-orange-50/40">
              <Statistic
                title="61-90 Days Past"
                value={totals.days61to90}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#ea580c" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-rose-50/40">
              <Statistic
                title="90+ Days Critical"
                value={totals.days90Plus}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#dc2626" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Table View */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Customer Receivable Aging Ledger ({filteredCustomers.length} Accounts)
            </span>
            <Input
              placeholder="Search by Customer name or Phone..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredCustomers}
            columns={columns}
            rowKey={(r: any) => r.customerId || Math.random()}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </Card>
      </div>
    </div>
  );
}
