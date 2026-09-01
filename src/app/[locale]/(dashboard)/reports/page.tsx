"use client";
import React, { useState } from "react";
import { Card, Row, Col, Input, Tag, Space, Button, Divider, Badge } from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  ShoppingOutlined,
  InboxOutlined,
  CarOutlined,
  TeamOutlined,
  AuditOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  RiseOutlined,
  PieChartOutlined,
  BankOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "next-intl";
import GbHeader from "@/components/ui/dashboard/GbHeader";

interface ReportItem {
  title: string;
  description: string;
  category: "financial" | "sales" | "inventory" | "logistics" | "hr";
  href: string;
  icon: any;
  tag: string;
  color: string;
}

export default function CentralReportsHub() {
  const local = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const reports: ReportItem[] = [
    // --- FINANCIAL & ACCOUNTING REPORTS ---
    {
      title: "Profit & Loss Statement (P&L)",
      description: "Multi-step income statement showing Gross Sales, COGS, Operating Expenses, and Net Profit.",
      category: "financial",
      href: `/${local}/accounting/profit-loss`,
      icon: <RiseOutlined />,
      tag: "Accounting",
      color: "green",
    },
    {
      title: "Balance Sheet Statement",
      description: "Complete financial position statement of Assets, Liabilities, and Equity as of any date.",
      category: "financial",
      href: `/${local}/accounting/balance-sheet`,
      icon: <BankOutlined />,
      tag: "Accounting",
      color: "blue",
    },
    {
      title: "General Ledger Statement",
      description: "Detailed account ledger statement with running balances, journal vouchers, and debits/credits.",
      category: "financial",
      href: `/${local}/accounting/general-ledger`,
      icon: <FileTextOutlined />,
      tag: "Accounting",
      color: "purple",
    },
    {
      title: "Trial Balance Statement",
      description: "Comprehensive debit-credit balance verification across all chart of accounts.",
      category: "financial",
      href: `/${local}/accounting/trial-balance`,
      icon: <AuditOutlined />,
      tag: "Accounting",
      color: "geekblue",
    },
    {
      title: "Customer Accounts Receivable (AR) Aging",
      description: "Customer outstanding invoice aging breakdown (Current, 1-30, 31-60, 61-90, 90+ days).",
      category: "financial",
      href: `/${local}/reports/customer-aging-report`,
      icon: <DollarOutlined />,
      tag: "Finance & AR",
      color: "orange",
    },
    {
      title: "Supplier Accounts Payable (AP) Aging",
      description: "Outstanding vendor bills, payment due dates, and liabilities breakdown per supplier.",
      category: "financial",
      href: `/${local}/reports/supplier-aging-report`,
      icon: <DollarOutlined />,
      tag: "Finance & AP",
      color: "volcano",
    },
    {
      title: "Operating Expenses & Cost Analysis",
      description: "Categorized expense breakdown (Rent, Utilities, Marketing, Packaging, Transport).",
      category: "financial",
      href: `/${local}/reports/expense-analysis-report`,
      icon: <PieChartOutlined />,
      tag: "Cost Centers",
      color: "magenta",
    },

    // --- SALES & CUSTOMER REPORTS ---
    {
      title: "Executive Sales Performance Report",
      description: "Summary of gross sales, net revenue, channel breakdown, and sales trends.",
      category: "sales",
      href: `/${local}/reports/sales-reports`,
      icon: <BarChartOutlined />,
      tag: "Sales",
      color: "blue",
    },
    {
      title: "Product-Wise Sales & Revenue Report",
      description: "SKU and product sales volumes, profit contributions, and units sold analysis.",
      category: "sales",
      href: `/${local}/reports/product-sales-report`,
      icon: <ShoppingOutlined />,
      tag: "Sales",
      color: "cyan",
    },
    {
      title: "Geographic Area & Regional Sales Report",
      description: "Division, District, and Thana order volumes, delivery rates, and regional growth trends.",
      category: "sales",
      href: `/${local}/reports/area-sales-report`,
      icon: <BarChartOutlined />,
      tag: "Geographic",
      color: "purple",
    },
    {
      title: "Customer Retention & Cohort Report",
      description: "Customer repurchase intervals, repeat buyer rate, and retention cohorts.",
      category: "sales",
      href: `/${local}/reports/customer-retention-report`,
      icon: <TeamOutlined />,
      tag: "Retention",
      color: "gold",
    },
    {
      title: "Top VIP Customers Leaderboard",
      description: "Highest lifetime value (LTV) customers, order frequency, and total spend.",
      category: "sales",
      href: `/${local}/reports/top-customers`,
      icon: <TeamOutlined />,
      tag: "VIP Clients",
      color: "lime",
    },

    // --- INVENTORY & SUPPLY CHAIN REPORTS ---
    {
      title: "Inventory Valuation & Stock Aging Report",
      description: "Warehouse stock on hand, average unit cost, total monetary valuation, and aging tiers.",
      category: "inventory",
      href: `/${local}/reports/inventory-valuation-report`,
      icon: <InboxOutlined />,
      tag: "Inventory",
      color: "indigo",
    },
    {
      title: "Low Stock & Reorder Forecasting",
      description: "Items approaching minimum threshold with stockout warnings and PO suggestions.",
      category: "inventory",
      href: `/${local}/inventory/valuation`,
      icon: <InboxOutlined />,
      tag: "Stock Alerts",
      color: "red",
    },
    {
      title: "Goods Receipt (GRN) & Purchase Report",
      description: "Supplier procurement receipts, QA inspection breakdown, and purchase invoices.",
      category: "inventory",
      href: `/${local}/procurement/purchase-report`,
      icon: <InboxOutlined />,
      tag: "Procurement",
      color: "geekblue",
    },

    // --- LOGISTICS & COURIER REPORTS ---
    {
      title: "Courier COD Reconciliation & Settlement",
      description: "Courier COD collections (Steadfast, Pathao, RedX) vs remittances and variance tracking.",
      category: "logistics",
      href: `/${local}/reports/courier-reconciliation-report`,
      icon: <CarOutlined />,
      tag: "Logistics",
      color: "green",
    },
    {
      title: "Shipment Tracking & Delivery Report",
      description: "Carrier transit times, delivery completion rate, and dispatch volumes.",
      category: "logistics",
      href: `/${local}/reports/shipment-report`,
      icon: <CarOutlined />,
      tag: "Shipments",
      color: "blue",
    },

    // --- HR & PAYROLL REPORTS ---
    {
      title: "Monthly Payroll & Salary Disbursal Sheet",
      description: "Employee salaries, allowances, deductions, attendance penalties, and net pay.",
      category: "hr",
      href: `/${local}/hr/payroll`,
      icon: <ScheduleOutlined />,
      tag: "Payroll",
      color: "purple",
    },
    {
      title: "Employee Attendance & Overtime Report",
      description: "Daily clock-in/out logs, late arrivals, leave balances, and attendance summary.",
      category: "hr",
      href: `/${local}/hr/attendance`,
      icon: <TeamOutlined />,
      tag: "Attendance",
      color: "gold",
    },
  ];

  const filteredReports = reports.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: "all", label: "All Reports", count: reports.length },
    { key: "financial", label: "Financial & Accounting", count: reports.filter((r) => r.category === "financial").length },
    { key: "sales", label: "Sales & Customer", count: reports.filter((r) => r.category === "sales").length },
    { key: "inventory", label: "Inventory & Supply Chain", count: reports.filter((r) => r.category === "inventory").length },
    { key: "logistics", label: "Logistics & Courier", count: reports.filter((r) => r.category === "logistics").length },
    { key: "hr", label: "HR & Payroll", count: reports.filter((r) => r.category === "hr").length },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Reports & Analytics Suite" />
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="bg-blue-800/80 text-blue-200 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              Enterprise BI & Reporting
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white m-0 mt-2">
              ERP Reports & Intelligence Center
            </h1>
            <p className="text-blue-200 text-sm mt-1 mb-0 max-w-2xl">
              Access real-time statements, financial ledgers, inventory audits, sales intelligence, courier reconciliations, and payroll analytics.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              placeholder="Search reports by name, tag or topic..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
              className="rounded-xl shadow"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeCategory === c.key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{c.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === c.key ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <Row gutter={[16, 16]}>
          {filteredReports.map((report, idx) => (
            <Col xs={24} sm={12} lg={8} key={idx}>
              <Link href={report.href} className="block h-full">
                <Card
                  hoverable
                  className="h-full rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  bodyStyle={{ padding: 20 }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        {report.icon}
                      </div>
                      <Tag color={report.color} className="font-semibold rounded-full px-2.5">
                        {report.tag}
                      </Tag>
                    </div>

                    <h3 className="text-base font-bold text-gray-800 m-0 mb-1 hover:text-blue-600 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed m-0 mb-4 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center text-blue-600 font-semibold text-xs pt-3 border-t border-gray-100 gap-1">
                    <span>Open Report Statement</span>
                    <ArrowRightOutlined className="text-[10px]" />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
            <InboxOutlined className="text-4xl text-gray-300 mb-2" />
            <h4 className="text-base font-bold text-gray-700">No matching reports found</h4>
            <p className="text-xs text-gray-400">Try changing your search keywords or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
