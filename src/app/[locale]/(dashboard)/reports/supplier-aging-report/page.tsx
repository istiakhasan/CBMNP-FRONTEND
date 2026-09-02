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
  Select,
} from "antd";
import {
  DollarOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  ShopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetSupplierBillsQuery } from "@/redux/api/financeApi";

const { Option } = Select;

export default function SupplierAgingReport() {
  const local = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: billsRes, isLoading } = useGetSupplierBillsQuery({
    status: statusFilter,
  });
  const bills: any[] = billsRes?.data || [];

  const totalPayable = bills.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const totalPaid = bills.reduce((sum, b) => sum + Number(b.paidAmount || 0), 0);
  const totalDue = bills.reduce((sum, b) => sum + Number(b.dueAmount || 0), 0);
  const overdueCount = bills.filter(
    (b) => b.dueAmount > 0 && b.dueDate && new Date(b.dueDate) < new Date()
  ).length;

  const filteredBills = bills.filter(
    (b: any) =>
      b.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.supplierInvoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: any = [
    {
      title: "Bill #",
      dataIndex: "billNumber",
      key: "billNumber",
      render: (billNumber: string) => (
        <span className="font-bold text-blue-700">{billNumber}</span>
      ),
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-xs">
            <ShopOutlined />
          </div>
          <span className="font-bold text-gray-800">{supplier?.name || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Bill Date",
      dataIndex: "billDate",
      key: "billDate",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => {
        const isPast = date && new Date(date) < new Date();
        return (
          <span className={isPast ? "text-rose-600 font-bold" : "text-gray-600"}>
            {date || "N/A"} {isPast && "⚠️"}
          </span>
        );
      },
    },
    {
      title: "Total Amount (Tk)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
      render: (val: number) => `৳ ${Number(val || 0).toLocaleString()}`,
    },
    {
      title: "Paid Amount (Tk)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (val: number) => (
        <span className="text-emerald-700 font-semibold">
          ৳ ${Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Outstanding Due (Tk)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      sorter: (a: any, b: any) => a.dueAmount - b.dueAmount,
      render: (val: number) => (
        <span className="font-extrabold text-rose-700">
          ৳ ${Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "Paid") return <Tag color="success">Paid</Tag>;
        if (status === "PartiallyPaid") return <Tag color="warning">Partially Paid</Tag>;
        if (status === "Unpaid") return <Tag color="error">Unpaid Due</Tag>;
        return <Tag color="default">{status}</Tag>;
      },
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Supplier Accounts Payable (AP) Aging & Bills Report" />
      <div className="p-4 md:p-6 space-y-6  mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Supplier Accounts Payable (AP) Statement
            </h2>
          </Space>
          <Space>
            <Select
              placeholder="Payment Status"
              className="w-44"
              allowClear
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
            >
              <Option value="Unpaid">Unpaid Bills</Option>
              <Option value="PartiallyPaid">Partially Paid</Option>
              <Option value="Paid">Fully Paid</Option>
            </Select>
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
                title="Total Invoiced Liabilities"
                value={totalPayable}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#1e3a8a" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Across {bills.length} vendor bills
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-emerald-50/40">
              <Statistic
                title="Total Paid to Date"
                value={totalPaid}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#059669" }}
              />
              <span className="text-xs text-emerald-700 mt-1 block">
                Disbursed vendor payments
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-rose-50/40">
              <Statistic
                title="Outstanding AP Liability"
                value={totalDue}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#dc2626" }}
              />
              <span className="text-xs text-rose-700 mt-1 block">
                Remaining payable balance
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-amber-50/40">
              <Statistic
                title="Overdue Bills"
                value={overdueCount}
                prefix={<CalendarOutlined className="text-amber-500" />}
                valueStyle={{ fontWeight: 800, color: "#b45309" }}
              />
              <span className="text-xs text-amber-700 mt-1 block">
                Bills past contractual due date
              </span>
            </Card>
          </Col>
        </Row>

        {/* Table View */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Supplier Bills & Payables Ledger ({filteredBills.length} Bills)
            </span>
            <Input
              placeholder="Search by Bill #, Supplier, or Invoice..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredBills}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
}
