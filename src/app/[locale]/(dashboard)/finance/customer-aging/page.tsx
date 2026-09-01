"use client";
import React from "react";
import { Table, Card, Row, Col, Statistic, Tag, Button, Space } from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { useGetCustomerAgingReportQuery } from "@/redux/api/financeApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

export default function CustomerAgingPage() {
  const { data, isLoading, refetch } = useGetCustomerAgingReportQuery(undefined);
  const rows = data?.data || [];

  const totalOutstanding = rows.reduce((sum: number, r: any) => sum + Number(r.totalDue || 0), 0);
  const currentTotal = rows.reduce((sum: number, r: any) => sum + Number(r.current || 0), 0);
  const overdue90Total = rows.reduce((sum: number, r: any) => sum + Number(r.over90 || 0), 0);

  const columns: any = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-400 block">{record.phone}</span>
        </div>
      ),
    },
    {
      title: "0 - 30 Days (Current)",
      dataIndex: "current",
      key: "current",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-emerald-700 font-medium">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "31 - 60 Days",
      dataIndex: "days31to60",
      key: "days31to60",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-blue-700 font-medium">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "61 - 90 Days",
      dataIndex: "days61to90",
      key: "days61to90",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-amber-700 font-medium">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "90+ Days (Overdue)",
      dataIndex: "over90",
      key: "over90",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-rose-700 font-bold">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Total Outstanding (Tk)",
      dataIndex: "totalDue",
      key: "totalDue",
      align: "right" as const,
      render: (val: number) => (
        <span className="font-bold text-gray-900">
          {Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Accounts Receivable: Customer Aging Report" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-indigo-600 shadow-sm">
            <Statistic
              title="Total Outstanding Receivables"
              value={totalOutstanding}
              precision={2}
              valueStyle={{ color: "#2f54eb" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic
              title="Current (0-30 Days)"
              value={currentTotal}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              suffix="Tk"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card size="small" className="border-l-4 border-rose-500 shadow-sm">
            <Statistic
              title="High Risk (90+ Days Overdue)"
              value={overdue90Total}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              suffix="Tk"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card
        title="Receivables Aging by Customer"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={rows} rowKey="customerId" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>
    </div>
  );
}
