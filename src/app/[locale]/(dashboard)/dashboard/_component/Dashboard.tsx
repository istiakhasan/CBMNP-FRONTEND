"use client";
import React from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { Card, Col, Row, Segmented, Statistic } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getUserInfo } from "@/service/authService";
import { useGetUserByIdQuery } from "@/redux/api/usersApi";
import { useGetProfileInfoQuery } from "@/redux/api/authApi";
import { useGetDashboardSummaryQuery } from "@/redux/api/dashboardApi";
import OrderStatusDistribution from "./OrderStatusDistribution";
import GbTable from "@/components/GbTable";
import CircleChar from "@/components/CircleChar";
import DeliveryPartner from "./DeliveryPartnerChart";
import TopCustomers from "./TopCustomers";
import TopProducts from "./TopProducts";
const PortFolioOverview = dynamic(() => import("./PortFolioOverview"), {
  ssr: false,
});
const Dashboard = () => {
  const { data: smData, isLoading: summaryLoading } =
    useGetDashboardSummaryQuery(undefined);
  const t = useTranslations("Dashboard");
  const userInfo: any = getUserInfo();
  const { data, isLoading } = useGetProfileInfoQuery({
    id: userInfo?.userId,
  });
  if (isLoading || summaryLoading) {
    return;
  }
  const summaryData = smData?.data;
  console.log(summaryData, "summary data");
  return (
    <div className="h-screen overflow-auto">
      <GbHeader title="Dashboard" />
      <div className="p-[16px]">
        <div className="flex items-start gap-2">
          <i className="ri-layout-grid-fill text-[20px]"></i>
          <div className="">
            <p className="text-[26px]  font-bold  leading-none">{t("title")}</p>
            <p className="text-[16px] text-gray-500  my-0 py-0">
              {t("bio")}
              {data?.data?.name}!
            </p>
          </div>
        </div>
        <div>
          <div className="my-4"></div>
          <Row gutter={[16, 16]} className="pb-4">
            <Col className="mb-5" xs={24} sm={12} md={12} lg={6}>
              <Card>
                <div className="flex  justify-between items-center">
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#8c8c8c",
                        marginBottom: 8,
                      }}
                    >
                      Pending Orders
                    </div>
                    <Statistic
                      value={summaryData?.totalPendingOrders?.total}
                      valueStyle={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#EA580C",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{ fontSize: 16, color: "#8c8c8c" }}
                      >
                        ৳ {summaryData?.totalPendingOrders?.price}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#FFEDD5]  h-[70px] w-[60px] flex items-center justify-center rounded-[8px]">
                    <i className="ri-time-line text-[28px] text-[#EA580C]"></i>
                  </div>
                </div>
              </Card>
            </Col>

            <Col className="mb-5" xs={24} sm={12} md={12} lg={6}>
              <Card>
                <div className="flex  justify-between items-center">
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#8c8c8c",
                        marginBottom: 8,
                      }}
                    >
                      Delivered Orders
                    </div>
                    <Statistic
                      value={summaryData?.totalDeliveredOrders?.total}
                      valueStyle={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#4F8A6D",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{ fontSize: 16, color: "#8c8c8c" }}
                      >
                        ৳ {summaryData?.totalDeliveredOrders?.price}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#DCFCE7]  h-[70px] w-[60px] flex items-center justify-center rounded-[8px]">
                    <i className="ri-checkbox-circle-line text-[28px] text-[#4F8A6D]"></i>
                  </div>
                </div>
              </Card>
            </Col>
            <Col className="mb-5" xs={24} sm={12} md={12} lg={6}>
              <Card>
                <div className="flex  justify-between items-center">
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#8c8c8c",
                        marginBottom: 8,
                      }}
                    >
                      Cancelled Orders
                    </div>
                    <Statistic
                      value={summaryData?.totalCancelledOrders?.total}
                      valueStyle={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#DC2626",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{ fontSize: 16, color: "#8c8c8c" }}
                      >
                        ৳ {summaryData?.totalCancelledOrders?.total}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#FEE2E2]  h-[70px] w-[60px] flex items-center justify-center rounded-[8px]">
                    <i className="ri-close-circle-fill text-[28px] text-[#DC2626]"></i>
                  </div>
                </div>
              </Card>
            </Col>
            <Col className="mb-5" xs={24} sm={12} md={12} lg={6}>
              <Card>
                <div className="flex  justify-between items-center flex-wrap">
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        color: "#8c8c8c",
                        marginBottom: 8,
                      }}
                    >
                      Total Revenue
                    </div>
                    <Statistic
                      value={"N/A"}
                      valueStyle={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#2563EB",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <ArrowUpOutlined
                        style={{ color: "#3f8600", marginRight: 4 }}
                      />
                      <span
                        style={{
                          color: "#3f8600",
                          fontSize: 14,
                          marginRight: 4,
                        }}
                      >
                        +20.1%
                      </span>
                      <span style={{ fontSize: 14, color: "#8c8c8c" }}>
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#DBEAFE]  h-[70px] w-[60px] flex items-center justify-center rounded-[8px]">
                    <i className="ri-money-dollar-circle-fill text-[28px] text-[#2563EB]"></i>
                  </div>
                </div>
              </Card>
            </Col>

            {/* total client  */}
            {/* <Col className='mb-5' span={6}>
              <Card >
                <div>
                  <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 8 }}>
                  <i className="ri-money-dollar-circle-line text-[18px]"></i> Assets Under Management
                  </div>
                  <Statistic
                    value={45231890}
                    valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <ArrowUpOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                    <span style={{ color: '#3f8600', fontSize: 14, marginRight: 4 }}>
                      +20.1%
                    </span>
                    <span style={{ fontSize: 14, color: '#8c8c8c' }}>from last month</span>
                  </div>
                </div>
              </Card>
            </Col> */}

            <Col style={{ height: "auto" }} className="mb-5"  xs={24} sm={12} md={12} lg={12}>
              <Card style={{ height: "auto" }} bordered={true}>
                <PortFolioOverview />
              </Card>
            </Col>
            <Col style={{ height: "auto" }} className="mb-5"  xs={24} sm={24} md={12} lg={12}>
              <Card style={{ height: "100%" }} bordered={true}>
                <OrderStatusDistribution />
              </Card>
            </Col>
            <Col style={{ height: "auto" }} className="mb-5" xs={24} sm={12} md={12} lg={12}>
              <Card style={{ height: "100%" }} bordered={true}>
                <DeliveryPartner />
              </Card>
            </Col>
            <Col style={{ height: "auto" }} className="mb-5" xs={24} sm={12} md={12} lg={12}>
              <TopProducts />
            </Col>
            <Col style={{ height: "auto" }} span={24}>
              <TopCustomers summaryData={summaryData} />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
