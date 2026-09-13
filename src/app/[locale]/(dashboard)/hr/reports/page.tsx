"use client";

import React, { useState } from "react";
import { Button, Card, Col, DatePicker, Empty, Form, Row, Select, Space, Statistic, Table, Tag } from "antd";
import { BarChartOutlined, CalendarOutlined, DownloadOutlined, ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetDepartmentsQuery, useGetHrReportQuery } from "@/redux/api/hrPayrollApi";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function HrReportsPage() {
  const [filters, setFilters] = useState<any>({ reportType: "employee-summary" });
  const [form] = Form.useForm();
  const { data: departmentsData } = useGetDepartmentsQuery(undefined);
  const { data, isLoading, refetch } = useGetHrReportQuery(filters);

  const departments = departmentsData?.data || [];
  const report = data?.data || {};
  const rows = Array.isArray(report) ? report : report.rows || report.employees || report.items || [];

  const handleFilter = (values: any) => {
    setFilters({
      ...values,
      fromDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
      toDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
      dateRange: undefined,
    });
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [report]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "HR Report");
    XLSX.writeFile(workbook, `hr-report-${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Reports" />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Total Employees" value={report.totalEmployees || rows.length || 0} prefix={<TeamOutlined className="text-blue-600" />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Present" value={report.present || report.presentToday || 0} prefix={<CalendarOutlined className="text-emerald-600" />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic title="Payroll Total" value={report.payrollTotal || 0} prefix={<BarChartOutlined className="text-purple-600" />} />
          </Card>
        </Col>
      </Row>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleFilter} initialValues={{ reportType: "employee-summary" }}>
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} md={6}>
              <Form.Item name="reportType" label="Report Type">
                <Select>
                  <Option value="employee-summary">Employee Summary</Option>
                  <Option value="attendance">Attendance</Option>
                  <Option value="leave">Leave</Option>
                  <Option value="payroll">Payroll</Option>
                  <Option value="overtime">Overtime</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="departmentId" label="Department">
                <Select allowClear placeholder="All departments">{departments.map((dept: any) => <Option key={dept.id} value={dept.id}>{dept.name}</Option>)}</Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={7}>
              <Form.Item name="dateRange" label="Date Range"><RangePicker className="w-full" /></Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-emerald-600 border-none">Generate</Button>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
                <Button icon={<DownloadOutlined />} disabled={!rows.length} onClick={exportExcel}>Excel</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Report Result" className="rounded-xl border border-gray-200 shadow-sm">
        {rows.length ? (
          <Table
            loading={isLoading}
            dataSource={rows}
            rowKey={(row: any, index) => row.id || row.employeeCode || String(index)}
            columns={[
              { title: "Employee", key: "employee", render: (_: any, r: any) => r.fullName || r.employee?.fullName || r.name || "-" },
              { title: "Department", key: "department", render: (_: any, r: any) => <Tag color="blue">{r.department?.name || r.departmentName || "-"}</Tag> },
              { title: "Designation", key: "designation", render: (_: any, r: any) => r.designation?.name || r.designationName || "-" },
              { title: "Status", key: "status", render: (_: any, r: any) => <Tag color={r.status === "Active" ? "green" : "orange"}>{r.status || "-"}</Tag> },
            ]}
          />
        ) : (
          <div className="py-14"><Empty description="Generate report to view data" /></div>
        )}
      </Card>
    </div>
  );
}
