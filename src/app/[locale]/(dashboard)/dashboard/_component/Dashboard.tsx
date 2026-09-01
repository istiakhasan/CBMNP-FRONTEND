"use client";
import React, { useState } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Card,
  Col,
  Row,
  Statistic,
  Radio,
  DatePicker,
  Space,
  Button,
  Tag,
  Tooltip,
  Divider,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  UsergroupAddOutlined,
  AccountBookOutlined,
  InboxOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getUserInfo } from "@/service/authService";
import { useGetProfileInfoQuery } from "@/redux/api/authApi";
import { useGetDashboardSummaryQuery } from "@/redux/api/dashboardApi";
import OrderStatusDistribution from "./OrderStatusDistribution";
import DeliveryPartner from "./DeliveryPartnerChart";
import TopCustomers from "./TopCustomers";
import TopProducts from "./TopProducts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const PortFolioOverview = dynamic(() => import("./PortFolioOverview"), {
  ssr: false,
});

const AreaWiseAnalytics = dynamic(() => import("./AreaWiseAnalytics"), {
  ssr: false,
});

export default function Dashboard() {
  const [period, setPeriod] = useState<string>("month");
  const [customRange, setCustomRange] = useState<any>(null);

  const queryParams: any = {
    period,
  };

  if (period === "custom" && customRange && customRange[0] && customRange[1]) {
    queryParams.startDate = customRange[0].format("YYYY-MM-DD");
    queryParams.endDate = customRange[1].format("YYYY-MM-DD");
  }

  const {
    data: smData,
    isLoading: summaryLoading,
    refetch,
  } = useGetDashboardSummaryQuery(queryParams);

  const t = useTranslations("Dashboard");
  const userInfo: any = getUserInfo();
  const { data: profileData } = useGetProfileInfoQuery({
    id: userInfo?.userId,
  });

  const summary = smData?.data;

  const grossSales = summary?.salesOverview?.grossSales ?? 0;
  const totalOrders = summary?.salesOverview?.totalOrders ?? 0;
  const aov = summary?.salesOverview?.aov ?? 0;

  const delivered = summary?.fulfillmentOverview?.delivered ?? {
    count: summary?.totalDeliveredOrders?.total || 0,
    amount: summary?.totalDeliveredOrders?.price || 0,
    rate: 0,
  };

  const pending = summary?.fulfillmentOverview?.pending ?? {
    count: summary?.totalPendingOrders?.total || 0,
    amount: summary?.totalPendingOrders?.price || 0,
  };

  const inTransit = summary?.fulfillmentOverview?.inTransit ?? { count: 0, amount: 0 };

  const cancelled = summary?.fulfillmentOverview?.cancelled ?? {
    count: summary?.totalCancelledOrders?.total || 0,
    amount: summary?.totalCancelledOrders?.price || 0,
    rate: 0,
  };

  const returned = summary?.fulfillmentOverview?.returned ?? { count: 0, amount: 0, rate: 0 };
  const returnLossRate = summary?.fulfillmentOverview?.returnLossRate ?? 0;

  const expenses = summary?.financialOverview?.operatingExpenses ?? 0;
  const grossProfit = summary?.financialOverview?.grossProfit ?? 0;
  const profitMargin = summary?.financialOverview?.profitMargin ?? 0;
  const outstandingAP = summary?.financialOverview?.outstandingAP ?? 0;

  const inventoryUnits = summary?.inventoryOverview?.totalUnits ?? 0;
  const inventoryValue = summary?.inventoryOverview?.totalValuation ?? 0;

  const totalClients = summary?.customerOverview?.totalClients ?? (summary?.totalClient || 0);
  const newClients = summary?.customerOverview?.newClientsInPeriod ?? 0;

  const periodLabels: Record<string, string> = {
    day: "Today's",
    week: "This Week's",
    month: "This Month's",
    year: "This Year's",
    all: "All Time",
    custom: "Selected Period",
  };

  const activePeriodLabel = periodLabels[period] || "Period";

  return (
    <div className="h-screen overflow-auto custom_scroll bg-[#f8fafc]">
      <GbHeader title="Dashboard" />
      <div className="p-4 md:p-6 space-y-6">
        {/* Header & Advanced Filter Bar */}
        <div className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold shadow-inner">
              <i className="ri-dashboard-3-line"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-800 m-0 tracking-tight">
                {t("title") || "Executive ERP Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 m-0">
                Welcome back, <span className="font-semibold text-gray-700">{profileData?.data?.name || "Admin"}</span>! Here is your real-time operational overview.
              </p>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <Radio.Group
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              buttonStyle="solid"
              size="middle"
            >
              <Radio.Button value="day">Day (Today)</Radio.Button>
              <Radio.Button value="week">Week</Radio.Button>
              <Radio.Button value="month">Month</Radio.Button>
              <Radio.Button value="year">Year</Radio.Button>
              <Radio.Button value="all">All Time</Radio.Button>
              <Radio.Button value="custom">Custom</Radio.Button>
            </Radio.Group>

            {period === "custom" && (
              <RangePicker
                value={customRange}
                onChange={(dates) => setCustomRange(dates)}
                size="middle"
                className="w-56"
              />
            )}

            <Tooltip title="Refresh real-time data">
              <Button
                icon={<ReloadOutlined spin={summaryLoading} />}
                onClick={() => refetch()}
                size="middle"
                className="flex items-center"
              >
                Sync
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* SECTION 1: CORE SALES & FULFILLMENT KPIS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Sales & Fulfillment Pipeline ({activePeriodLabel})
            </span>
            <Tag color="blue" className="text-xs font-medium">
              Live Real-Time
            </Tag>
          </div>

          <Row gutter={[16, 16]}>
            {/* Gross Invoiced Sales */}
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-sm hover:shadow transition-shadow border-t-4 border-t-blue-500 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-1">
                      Gross Invoiced Sales
                    </span>
                    <Statistic
                      value={grossSales}
                      precision={2}
                      prefix="৳"
                      valueStyle={{ fontSize: 22, fontWeight: 800, color: "#1e3a8a" }}
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                      <Tag color="blue">{totalOrders} Orders</Tag>
                      <span>AOV: ৳{aov.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                    <DollarOutlined />
                  </div>
                </div>
              </Card>
            </Col>

            {/* Net Delivered Revenue */}
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-sm hover:shadow transition-shadow border-t-4 border-t-emerald-500 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-1">
                      Realized Delivered Cash
                    </span>
                    <Statistic
                      value={delivered.amount}
                      precision={2}
                      prefix="৳"
                      valueStyle={{ fontSize: 22, fontWeight: 800, color: "#065f46" }}
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium">
                      <Tag color="green">{delivered.count} Delivered</Tag>
                      <span className="text-emerald-700 font-semibold">
                        {delivered.rate > 0 ? `${delivered.rate}% Success` : "Delivered"}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-2xl">
                    <CheckCircleOutlined />
                  </div>
                </div>
              </Card>
            </Col>

            {/* In-Transit & Processing Pipeline */}
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-sm hover:shadow transition-shadow border-t-4 border-t-amber-500 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-1">
                      Active Order Pipeline
                    </span>
                    <Statistic
                      value={pending.amount + inTransit.amount}
                      precision={2}
                      prefix="৳"
                      valueStyle={{ fontSize: 22, fontWeight: 800, color: "#b45309" }}
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-amber-700">
                      <Tag color="warning">{pending.count} Pending</Tag>
                      <Tag color="gold">{inTransit.count} In-Transit</Tag>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 text-2xl">
                    <CarOutlined />
                  </div>
                </div>
              </Card>
            </Col>

            {/* Cancelled & Return Loss */}
            <Col xs={24} sm={12} lg={6}>
              <Card className="shadow-sm hover:shadow transition-shadow border-t-4 border-t-rose-500 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-1">
                      Cancelled & Return Loss
                    </span>
                    <Statistic
                      value={cancelled.amount + returned.amount}
                      precision={2}
                      prefix="৳"
                      valueStyle={{ fontSize: 22, fontWeight: 800, color: "#9f1239" }}
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-rose-600">
                      <Tag color="error">{cancelled.count + returned.count} Orders</Tag>
                      <span>{returnLossRate}% Loss Rate</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 text-2xl">
                    <CloseCircleOutlined />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* SECTION 2: PROFITABILITY & WORKING CAPITAL KPIS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Profitability, Expenses & Working Capital Assets
            </span>
          </div>

          <Row gutter={[16, 16]}>
            {/* Operating Expenses */}
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
                <span className="text-xs text-gray-400 font-semibold block mb-1">Operating Expenses</span>
                <Statistic
                  value={expenses}
                  precision={2}
                  prefix="৳"
                  valueStyle={{ fontSize: 18, fontWeight: 700, color: "#e11d48" }}
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Incurred in period</span>
              </Card>
            </Col>

            {/* Estimated Gross Profit */}
            <Col xs={24} sm={12} md={8} lg={5}>
              <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold block mb-1">Est. Gross Margin</span>
                  <Tag color={grossProfit >= 0 ? "green" : "red"} className="text-[10px]">
                    {profitMargin}%
                  </Tag>
                </div>
                <Statistic
                  value={grossProfit}
                  precision={2}
                  prefix="৳"
                  valueStyle={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: grossProfit >= 0 ? "#15803d" : "#be123c",
                  }}
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Delivered Sales - Expenses</span>
              </Card>
            </Col>

            {/* Supplier Payables (AP) */}
            <Col xs={24} sm={12} md={8} lg={5}>
              <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
                <span className="text-xs text-gray-400 font-semibold block mb-1">Supplier Bills Due (AP)</span>
                <Statistic
                  value={outstandingAP}
                  precision={2}
                  prefix="৳"
                  valueStyle={{ fontSize: 18, fontWeight: 700, color: "#d97706" }}
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Pending Vendor Payables</span>
              </Card>
            </Col>

            {/* Stock Valuation */}
            <Col xs={24} sm={12} md={8} lg={5}>
              <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
                <span className="text-xs text-gray-400 font-semibold block mb-1">Warehouse Stock Value</span>
                <Statistic
                  value={inventoryValue}
                  precision={2}
                  prefix="৳"
                  valueStyle={{ fontSize: 18, fontWeight: 700, color: "#4338ca" }}
                />
                <span className="text-[11px] text-gray-400 mt-1 block">{inventoryUnits.toLocaleString()} units in stock</span>
              </Card>
            </Col>

            {/* Customer Base & Acquisition */}
            <Col xs={24} sm={12} md={8} lg={5}>
              <Card className="shadow-sm border-gray-200 rounded-xl bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold block mb-1">Customers Base</span>
                  {newClients > 0 && <Tag color="blue">+{newClients} New</Tag>}
                </div>
                <Statistic
                  value={totalClients}
                  valueStyle={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}
                  suffix="Clients"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Registered Customer Base</span>
              </Card>
            </Col>
          </Row>
        </div>

        {/* SECTION 3: VISUAL CHARTS & OPERATIONAL ANALYTICS */}
        <Row gutter={[16, 16]}>
          {/* Revenue & Trend Bar Chart */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-gray-200 rounded-xl h-full" bordered={false}>
              <PortFolioOverview
                chartData={summary?.chartData}
                periodTitle={`Sales & Revenue Inflow (${activePeriodLabel})`}
              />
            </Card>
          </Col>

          {/* Order Status Distribution Ring */}
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-gray-200 rounded-xl h-full" bordered={false}>
              <OrderStatusDistribution />
            </Card>
          </Col>
        </Row>

        {/* SECTION 4: GEOGRAPHIC AREA-WISE ANALYTICS (DIVISION / DISTRICT / THANA) */}
        <div>
          <AreaWiseAnalytics
            period={period}
            startDate={queryParams.startDate}
            endDate={queryParams.endDate}
          />
        </div>

        {/* SECTION 5: DELIVERY PARTNERS, TOP PRODUCTS & TOP CUSTOMERS */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-gray-200 rounded-xl h-full" bordered={false}>
              <DeliveryPartner />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="shadow-sm border-gray-200 rounded-xl h-full" bordered={false}>
              <TopProducts />
            </Card>
          </Col>

          <Col span={24}>
            <Card className="shadow-sm border-gray-200 rounded-xl" bordered={false}>
              <TopCustomers summaryData={summary} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
