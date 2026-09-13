"use client";

import React from "react";
import { Alert, Button, Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import { CalendarOutlined, DollarOutlined, ReloadOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetHrDashboardQuery } from "@/redux/api/hrPayrollApi";

const { Title } = Typography;

export default function HrDashboardPage() {
  const { data, isLoading, isError, refetch } = useGetHrDashboardQuery(undefined);
  const dash = data?.data || {};

  const departmentRows = dash.departmentWiseEmployees || dash.departments || [];
  const recentRows = dash.recentEmployees || dash.newJoiners || [];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Dashboard" />

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Failed to load HR dashboard"
          action={<Button icon={<ReloadOutlined />} onClick={() => refetch()}>Retry</Button>}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Total Employees" value={dash.totalEmployees || 0} prefix={<TeamOutlined className="text-blue-600" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Present Today" value={dash.presentToday || 0} prefix={<CalendarOutlined className="text-emerald-600" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="New Joining" value={dash.newJoining || dash.newJoinersCount || 0} prefix={<UserAddOutlined className="text-purple-600" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Pending Payroll" value={dash.pendingPayroll || 0} prefix={<DollarOutlined className="text-amber-500" />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Department Wise Employees" className="rounded-xl border border-gray-200 shadow-sm">
            <Table
              loading={isLoading}
              dataSource={departmentRows}
              rowKey={(row: any) => row.id || row.departmentId || row.name}
              pagination={false}
              columns={[
                { title: "Department", dataIndex: "name", key: "name", render: (v: string, r: any) => v || r.departmentName || "General" },
                { title: "Employees", dataIndex: "count", key: "count", align: "center" as const },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Joiners" className="rounded-xl border border-gray-200 shadow-sm">
            <Table
              loading={isLoading}
              dataSource={recentRows}
              rowKey={(row: any) => row.id || row.employeeCode}
              pagination={false}
              columns={[
                { title: "Employee", dataIndex: "fullName", key: "name", render: (v: string, r: any) => v || r.name },
                { title: "Department", dataIndex: ["department", "name"], key: "department", render: (v: string) => <Tag color="blue">{v || "General"}</Tag> },
                { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Active" ? "green" : "orange"}>{v || "Active"}</Tag> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
