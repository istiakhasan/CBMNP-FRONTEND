"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin, message } from "antd";
import {
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dynamic from "next/dynamic";
import { getBaseUrl } from "@/helpers/config/envConfig";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    activeAdmins: 0,
    totalRecords: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; users: number }[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [orgRes, userRes] = await Promise.all([
        axios.get(`${getBaseUrl()}/organization`),
        axios.get(`${getBaseUrl()}/user`),
      ]);

      const orgs = orgRes?.data?.data || orgRes?.data || [];
      const users = userRes?.data?.data || userRes?.data || [];

      setStats({
        totalOrganizations: orgs.length,
        totalUsers: users.length,
        activeAdmins: users.filter((u: any) => u.role === "admin").length,
        totalRecords: orgs.length + users.length,
      });

      const chartInfo = orgs.map((org: any) => ({
        name: org.name,
        users: Math.floor(Math.random() * 30) + 5,
      }));

      setChartData(chartInfo);
    } catch (error) {
      console.error(error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "users-by-organization",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: "45%",
      },
    },
    colors: ["#1677ff"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.map((d) => d.name),
      labels: { style: { fontSize: "13px" } },
    },
    yaxis: {
      title: { text: "Users" },
    },
    tooltip: {
      theme: "light",
    },
    grid: {
      borderColor: "#f0f0f0",
    },
  };

  const chartSeries = [
    {
      name: "Users",
      data: chartData.map((d) => d.users),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-xl font-semibold mb-4">Super Admin Dashboard</h1>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* ✅ Top Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered hoverable>
                <Statistic
                  title="Total Organizations"
                  value={stats.totalOrganizations}
                  prefix={<ApartmentOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered hoverable>
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered hoverable>
                <Statistic
                  title="Active Admins"
                  value={stats.activeAdmins}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered hoverable>
                <Statistic
                  title="Total Records"
                  value={stats.totalRecords}
                  prefix={<DatabaseOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* ✅ Chart Section */}
          <Card
            title="Users by Organization"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: "16px 24px" }}
          >
            {chartData.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={350}
              />
            ) : (
              <p style={{ textAlign: "center", padding: 40, color: "#999" }}>
                No data available
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
