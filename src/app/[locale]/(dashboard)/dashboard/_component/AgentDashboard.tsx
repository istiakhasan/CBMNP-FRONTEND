"use client";
import React from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Card, Col, Row, Statistic, Table, Tag, Empty } from "antd";
import { useTranslations } from "next-intl";
import { getUserInfo } from "@/service/authService";
import { useGetProfileInfoQuery } from "@/redux/api/authApi";
import { useGetAgentDashboardSummaryQuery } from "@/redux/api/dashboardApi";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

const AgentProgressChart = dynamic(() => import("./AgentProgressChart"), {
  ssr: false,
});

const AgentDashboard = () => {
  const userInfo: any = getUserInfo();
  const { data: profile } = useGetProfileInfoQuery({ id: userInfo?.userId });
  const { data: summaryRes, isLoading } = useGetAgentDashboardSummaryQuery(undefined);

  if (isLoading) return null;

  const summary:any = summaryRes?.data;

  const statusColorMap: any = {
    Pending: "orange",
    Approved: "blue",
    Delivered: "green",
    Cancelled: "red",
    Hold: "gold",
  };

  const columns:any = [
    {
      title: "Order No",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      render: (v: string) => v || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (v: number) => `৳ ${v?.toLocaleString() || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: string) => <Tag color={statusColorMap[v] || "default"}>{v || "N/A"}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => (v ? dayjs(v).format("DD MMM, hh:mm A") : "N/A"),
    },
  ];

  return (
    <div className="h-screen overflow-auto custom_scroll">
      <GbHeader title="My Dashboard" />
      <div className="p-[16px]">
        <div className="flex items-start gap-2 mb-4">
          <i className="ri-user-star-fill text-[20px]"></i>
          <div>
            <p className="text-[26px] font-bold leading-none">
              Welcome back, {profile?.data?.name}!
            </p>
            <p className="text-[16px] text-gray-500 my-0 py-0">
              Here is how your orders are performing
            </p>
          </div>
        </div>

        {/* Today / Week / Month / Total cards */}
        <Row gutter={[16, 16]} className="pb-2">
          <Col xs={24} sm={12} md={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>
                   {"Today's Orders"}
                  </div>
                  <Statistic
                    value={summary?.today?.orders || 0}
                    valueStyle={{ fontSize: 22, fontWeight: "bold", color: "#2563EB" }}
                  />
                  <div className="mt-1 text-[13px] text-gray-500">
                    ৳ {summary?.today?.revenue?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-[#DBEAFE] h-[60px] w-[52px] flex items-center justify-center rounded-[8px]">
                  <i className="ri-calendar-todo-line text-[24px] text-[#2563EB]"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>
                    This Week
                  </div>
                  <Statistic
                    value={summary?.thisWeek?.orders || 0}
                    valueStyle={{ fontSize: 22, fontWeight: "bold", color: "#7C3AED" }}
                  />
                  <div className="mt-1 text-[13px] text-gray-500">
                    ৳ {summary?.thisWeek?.revenue?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-[#EDE9FE] h-[60px] w-[52px] flex items-center justify-center rounded-[8px]">
                  <i className="ri-calendar-2-line text-[24px] text-[#7C3AED]"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>
                    This Month
                  </div>
                  <Statistic
                    value={summary?.thisMonth?.orders || 0}
                    valueStyle={{ fontSize: 22, fontWeight: "bold", color: "#4F8A6D" }}
                  />
                  <div className="mt-1 text-[13px] text-gray-500">
                    ৳ {summary?.thisMonth?.revenue?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="bg-[#DCFCE7] h-[60px] w-[52px] flex items-center justify-center rounded-[8px]">
                  <i className="ri-calendar-event-line text-[24px] text-[#4F8A6D]"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: 14, color: "#8c8c8c", marginBottom: 8 }}>
                    Total Orders Served
                  </div>
                  <Statistic
                    value={summary?.totalOrdersServed || 0}
                    valueStyle={{ fontSize: 22, fontWeight: "bold", color: "#EA580C" }}
                  />
                  <div className="mt-1 text-[13px] text-gray-500">
                    ৳ {summary?.totalRevenue?.toLocaleString() || 0} lifetime
                  </div>
                </div>
                <div className="bg-[#FFEDD5] h-[60px] w-[52px] flex items-center justify-center rounded-[8px]">
                  <i className="ri-trophy-line text-[24px] text-[#EA580C]"></i>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Status breakdown */}
        <Row gutter={[16, 16]} className="pb-2">
          {summary?.statusBreakdown?.map((s: any) => (
            <Col xs={12} sm={8} md={6} lg={4} key={s.label}>
              <Card size="small">
                <div className="text-[12px] text-gray-500">{s.label}</div>
                <div className="text-[20px] font-bold">{s.count}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Weekly / Daily trend chart */}
        <Row gutter={[16, 16]} className="pb-2">
          <Col xs={24} lg={16}>
            <Card title="Last 7 Days — Orders & Revenue" bordered>
              {summary?.dailyTrend?.length ? (
                <AgentProgressChart data={summary.dailyTrend} xKey="date" />
              ) : (
                <Empty description="No recent activity" />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Last 6 Months" bordered>
              {summary?.monthlyTrend?.length ? (
                <AgentProgressChart data={summary.monthlyTrend as any} xKey="month" compact />
              ) : (
                <Empty description="No history yet" />
              )}
            </Card>
          </Col>
        </Row>

        {/* Recent orders */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Recent Orders" bordered>
              <Table
                dataSource={summary?.recentOrders || []}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: "No orders yet" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AgentDashboard;