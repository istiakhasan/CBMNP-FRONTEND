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
  DatePicker,
} from "antd";
import {
  PieChartOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetExpensesQuery, useGetExpenseCategoriesQuery } from "@/redux/api/financeApi";

const { RangePicker } = DatePicker;

export default function ExpenseAnalysisReport() {
  const local = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<any>(null);

  const queryParams: any = {};
  if (dateRange && dateRange[0] && dateRange[1]) {
    queryParams.startDate = dateRange[0].format("YYYY-MM-DD");
    queryParams.endDate = dateRange[1].format("YYYY-MM-DD");
  }

  const { data: expRes, isLoading } = useGetExpensesQuery(queryParams);
  const { data: catRes } = useGetExpenseCategoriesQuery(undefined);

  const expenses: any[] = expRes?.data || [];
  const categories: any[] = catRes?.data || [];

  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // Group by category
  const categoryMap = new Map<string, { name: string; amount: number; count: number }>();
  expenses.forEach((e) => {
    const catName = e.expenseCategory?.name || "General Expenses";
    const existing = categoryMap.get(catName) || { name: catName, amount: 0, count: 0 };
    existing.amount += Number(e.amount || 0);
    existing.count += 1;
    categoryMap.set(catName, existing);
  });

  const categoryBreakdown = Array.from(categoryMap.values()).map((c) => ({
    ...c,
    percentage: totalExpense > 0 ? Number(((c.amount / totalExpense) * 100).toFixed(1)) : 0,
  })).sort((a, b) => b.amount - a.amount);

  const filteredExpenses = expenses.filter(
    (e: any) =>
      e.expenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.expenseCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const expColumns: any = [
    {
      title: "Expense #",
      dataIndex: "expenseNumber",
      key: "expenseNumber",
      render: (num: string) => <Tag color="blue">{num}</Tag>,
    },
    {
      title: "Expense Date",
      dataIndex: "expenseDate",
      key: "expenseDate",
    },
    {
      title: "Title / Description",
      dataIndex: "title",
      key: "title",
      render: (t: string, record: any) => (
        <div>
          <span className="font-bold text-gray-800 block">{t}</span>
          <span className="text-xs text-gray-400">{record.notes || "-"}</span>
        </div>
      ),
    },
    {
      title: "Cost Category",
      dataIndex: "expenseCategory",
      key: "expenseCategory",
      render: (cat: any) => (
        <Tag color="purple" className="font-medium">
          {cat?.name || "Uncategorized"}
        </Tag>
      ),
    },
    {
      title: "Payment Account",
      dataIndex: "bankAccount",
      key: "bankAccount",
      render: (acc: any) => acc?.accountName || "Cash/Bank",
    },
    {
      title: "Amount (Tk)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amt: number) => (
        <span className="font-extrabold text-rose-700">
          ৳ ${Number(amt || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color="green">{status || "Approved"}</Tag>,
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Operating Expense Category & Cost Analysis Report" />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Space>
            <Link href={`/${local}/reports`}>
              <Button icon={<ArrowLeftOutlined />}>Reports Hub</Button>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-800 m-0">
              Operating Expense & Cost Center Analysis
            </h2>
          </Space>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(val) => setDateRange(val)}
              className="w-64"
            />
            <Button icon={<DownloadOutlined />}>Export CSV</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
              Print Statement
            </Button>
          </Space>
        </div>

        {/* Top Summary & Category Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className="rounded-xl border-gray-200 shadow-sm">
              <Statistic
                title="Total Operating Expenditures"
                value={totalExpense}
                prefix="৳"
                precision={2}
                valueStyle={{ fontWeight: 800, color: "#9f1239" }}
              />
              <span className="text-xs text-gray-400 mt-1 block">
                Across {expenses.length} logged expense vouchers
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-purple-50/40">
              <Statistic
                title="Active Cost Centers"
                value={categoryBreakdown.length}
                prefix={<PieChartOutlined className="text-purple-500" />}
                valueStyle={{ fontWeight: 800, color: "#6b21a8" }}
              />
              <span className="text-xs text-purple-700 mt-1 block">
                Distinct expense categories
              </span>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="rounded-xl border-gray-200 shadow-sm bg-blue-50/40">
              <Statistic
                title="Largest Cost Driver"
                value={categoryBreakdown[0]?.name || "N/A"}
                valueStyle={{ fontWeight: 700, fontSize: 18, color: "#1e3a8a" }}
              />
              <span className="text-xs text-blue-700 mt-1 block">
                ৳ {Number(categoryBreakdown[0]?.amount || 0).toLocaleString()} ({categoryBreakdown[0]?.percentage || 0}%)
              </span>
            </Card>
          </Col>
        </Row>

        {/* Category Breakdown Table */}
        <Card title="Category Expense Distribution" className="rounded-xl border-gray-200 shadow-sm">
          <Row gutter={[16, 16]}>
            {categoryBreakdown.map((cat, idx) => (
              <Col xs={24} sm={12} lg={8} key={idx}>
                <div className="border border-gray-100 p-3 rounded-xl bg-gray-50/60 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800 block text-sm">{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.count} vouchers ({cat.percentage}% share)</span>
                  </div>
                  <span className="font-extrabold text-rose-700 text-sm">
                    ৳ {Number(cat.amount).toLocaleString()}
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Expense Voucher Ledger */}
        <Card className="rounded-xl border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700 text-sm">
              Expense Vouchers Ledger ({filteredExpenses.length} Vouchers)
            </span>
            <Input
              placeholder="Search by Expense #, Title, Category..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72"
              allowClear
            />
          </div>
          <Table
            dataSource={filteredExpenses}
            columns={expColumns}
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
