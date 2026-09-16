"use client";

import React, { useState } from "react";
import { Button, Card, Col, DatePicker, Empty, Form, Row, Select, Space, Statistic, Table, Tag, Alert } from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetDepartmentsQuery, useGetEmployeesQuery, useGetHrReportQuery } from "@/redux/api/hrPayrollApi";

const { RangePicker } = DatePicker;
const { Option } = Select;

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const REPORT_TYPES = [
  { value: "employee-summary", label: "Employee Summary" },
  { value: "attendance", label: "Attendance" },
  { value: "employee-attendance", label: "Employee-wise Attendance" },
  { value: "department-attendance", label: "Department-wise Attendance" },
  { value: "leave", label: "Leave" },
  { value: "payroll", label: "Payroll" },
  { value: "salary", label: "Salary Report" },
  { value: "overtime", label: "Overtime" },
  { value: "recruitment", label: "Recruitment" },
  { value: "training", label: "Training" },
];

// Date range only makes sense for day-level report types (payroll is a monthly run;
// recruitment/training aren't filtered by a punch/leave/pay date here).
const DATE_RANGE_APPLICABLE = new Set(["attendance", "employee-attendance", "department-attendance", "leave", "overtime"]);
const MONTH_APPLICABLE = new Set(["payroll", "salary"]);

export default function HrReportsPage() {
  const [reportType, setReportType] = useState("employee-summary");
  const [filters, setFilters] = useState<any>({ type: "employee-summary" });
  const [form] = Form.useForm();
  const { data: departmentsData } = useGetDepartmentsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery({ limit: 1000 });
  const { data, isLoading, isFetching, error, refetch } = useGetHrReportQuery(filters);

  const departments = departmentsData?.data || [];
  const employees = employeesData?.data?.data || employeesData?.data || [];
  const report = data?.data || {};
  const summary = report.summary || {};
  const rows: any[] = report.rows || [];

  const handleFilter = (values: any) => {
    const next: any = {
      type: values.reportType,
      departmentId: values.departmentId || undefined,
      status: values.status || undefined,
      employeeId: values.employeeId || undefined,
    };
    if (DATE_RANGE_APPLICABLE.has(values.reportType)) {
      next.from = values.dateRange?.[0]?.format("YYYY-MM-DD");
      next.to = values.dateRange?.[1]?.format("YYYY-MM-DD");
    }
    if (MONTH_APPLICABLE.has(values.reportType) && values.month) {
      next.year = values.month.year();
      next.month = values.month.month() + 1;
    }
    setReportType(values.reportType);
    setFilters(next);
  };

  const exportExcel = () => {
    const flat = rows.map((r) => flattenRowForExport(reportType, r));
    const sheet = XLSX.utils.json_to_sheet(flat.length ? flat : [{}]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "HR Report");
    XLSX.writeFile(workbook, `hr-${reportType}-report-${dayjs().format("YYYY-MM-DD")}.xlsx`);
  };

  const summaryCards = getSummaryCards(reportType, summary);
  const columns = getColumns(reportType);

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Reports" />

      <Row gutter={[16, 16]}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} md={6} key={card.key}>
            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <Statistic
                title={<span className="text-xs font-bold text-gray-500 uppercase">{card.label}</span>}
                value={card.value}
                prefix={card.icon}
                valueStyle={{ fontWeight: "bold", color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleFilter} initialValues={{ reportType: "employee-summary" }}>
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} md={6}>
              <Form.Item name="reportType" label="Report Type">
                <Select onChange={(v) => setReportType(v)}>
                  {REPORT_TYPES.map((rt) => (
                    <Option key={rt.value} value={rt.value}>{rt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="departmentId" label="Department">
                <Select allowClear placeholder="All departments">
                  {departments.map((dept: any) => <Option key={dept.id} value={dept.id}>{dept.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="employeeId" label="Employee">
                <Select allowClear showSearch optionFilterProp="label" placeholder="All employees">
                  {employees.map((employee: any) => <Option key={employee.id} value={employee.id} label={`${employee.fullName} (${employee.employeeCode})`}>{employee.fullName} ({employee.employeeCode})</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={7}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                tooltip={!DATE_RANGE_APPLICABLE.has(reportType) ? "Not applicable to this report type" : undefined}
              >
                <RangePicker className="w-full" disabled={!DATE_RANGE_APPLICABLE.has(reportType)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={5}>
              <Form.Item name="month" label="Salary Month" tooltip={!MONTH_APPLICABLE.has(reportType) ? "Only used for salary reports" : undefined}>
                <DatePicker picker="month" className="w-full" disabled={!MONTH_APPLICABLE.has(reportType)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
              <Space>
                <Button type="primary" htmlType="submit" className="bg-emerald-600 border-none">Generate</Button>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
                <Button icon={<DownloadOutlined />} disabled={!rows.length} onClick={exportExcel}>Excel</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {error ? (
        <Alert
          type="error"
          showIcon
          message="Could not generate this report"
          description={(error as any)?.data?.message || "Something went wrong — try Generate again."}
        />
      ) : null}

      <Card title={`Report Result (${rows.length})`} className="rounded-xl border border-gray-200 shadow-sm">
        {rows.length ? (
          <Table
            loading={isLoading || isFetching}
            dataSource={rows}
            rowKey={(row: any, index) => row.id || String(index)}
            columns={columns}
            pagination={{ pageSize: 15, showSizeChanger: true }}
            className="custom_scroll"
            scroll={{ x: "max-content" }}
          />
        ) : (
          <div className="py-14">
            <Empty description={isLoading || isFetching ? "Loading..." : "No data for this filter — try Generate or widen the filters"} />
          </div>
        )}
      </Card>
    </div>
  );
}

function getSummaryCards(reportType: string, summary: any) {
  switch (reportType) {
    case "employee-summary":
      return [
        { key: "total", label: "Total Employees", value: summary.totalEmployees || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "active", label: "Active", value: summary.activeCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "probation", label: "On Probation", value: summary.probationCount || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "resigned", label: "Resigned / Terminated", value: summary.resignedCount || 0, icon: <CloseCircleOutlined className="text-rose-500" />, color: "#e11d48" },
      ];
    case "attendance":
      return [
        { key: "total", label: "Total Records", value: summary.totalRecords || 0, icon: <CalendarOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "present", label: "Present", value: summary.presentCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "late", label: "Late", value: summary.lateCount || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "avgHrs", label: "Avg Work Hours", value: summary.avgWorkHours || 0, icon: <BarChartOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "employee-attendance":
      return [
        { key: "employees", label: "Employees", value: summary.totalEmployees || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "present", label: "Present Days", value: summary.presentDays || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "late", label: "Late Days", value: summary.lateDays || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "hours", label: "Work Hours", value: summary.totalWorkHours || 0, icon: <BarChartOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "department-attendance":
      return [
        { key: "departments", label: "Departments", value: summary.totalDepartments || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "employees", label: "Employees", value: summary.totalEmployees || 0, icon: <TeamOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "present", label: "Present Records", value: summary.presentCount || 0, icon: <CheckCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "hours", label: "Work Hours", value: summary.totalWorkHours || 0, icon: <BarChartOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "leave":
      return [
        { key: "total", label: "Total Requests", value: summary.totalRequests || 0, icon: <CalendarOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "approved", label: "Approved", value: summary.approvedCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "pending", label: "Pending", value: summary.pendingCount || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "days", label: "Approved Days Taken", value: summary.totalDaysApproved || 0, icon: <BarChartOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "payroll":
      return [
        { key: "employees", label: "Employees Paid", value: summary.employeeCount || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "gross", label: "Total Gross (৳)", value: summary.totalGross || 0, icon: <DollarOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "deductions", label: "Total Deductions (৳)", value: summary.totalDeductions || 0, icon: <DollarOutlined className="text-rose-500" />, color: "#e11d48" },
        { key: "net", label: "Total Net Salary (৳)", value: summary.totalNetSalary || 0, icon: <DollarOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "overtime":
      return [
        { key: "total", label: "Total Requests", value: summary.totalRequests || 0, icon: <CalendarOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "approved", label: "Approved", value: summary.approvedCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "hours", label: "Approved Hours", value: summary.totalApprovedHours || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
        { key: "amount", label: "Total Amount (৳)", value: summary.totalOvertimeAmount || 0, icon: <DollarOutlined className="text-purple-600" />, color: "#7c3aed" },
      ];
    case "recruitment":
      return [
        { key: "total", label: "Total Applications", value: summary.totalApplications || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "hired", label: "Hired", value: summary.hiredCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
        { key: "inProgress", label: "In Progress", value: summary.inProgressCount || 0, icon: <ClockCircleOutlined className="text-amber-500" />, color: "#d97706" },
      ];
    case "training":
      return [
        { key: "total", label: "Total Enrollments", value: summary.totalEnrollments || 0, icon: <TeamOutlined className="text-blue-600" />, color: "#2563eb" },
        { key: "completed", label: "Completed", value: summary.completedCount || 0, icon: <CheckCircleOutlined className="text-emerald-600" />, color: "#059669" },
      ];
    default:
      return [];
  }
}

function getColumns(reportType: string): any[] {
  const employeeCol = {
    title: "Employee",
    key: "employee",
    render: (_: any, r: any) => (
      <div>
        <span className="font-semibold text-gray-900 block text-sm">{r.employee?.fullName || r.fullName || "-"}</span>
        <span className="text-xs text-gray-400 font-mono">{r.employee?.employeeCode || r.employeeCode}</span>
      </div>
    ),
  };
  const departmentCol = {
    title: "Department",
    key: "department",
    render: (_: any, r: any) => <Tag color="blue">{r.employee?.department?.name || r.department?.name || "-"}</Tag>,
  };

  switch (reportType) {
    case "employee-summary":
      return [
        {
          title: "Employee",
          key: "employee",
          render: (_: any, r: any) => (
            <div>
              <span className="font-semibold text-gray-900 block text-sm">{r.fullName}</span>
              <span className="text-xs text-gray-400 font-mono">{r.employeeCode}</span>
            </div>
          ),
        },
        { title: "Department", key: "department", render: (_: any, r: any) => <Tag color="blue">{r.department?.name || "-"}</Tag> },
        { title: "Designation", key: "designation", render: (_: any, r: any) => r.designation?.name || "-" },
        { title: "Reporting Manager", key: "manager", render: (_: any, r: any) => r.reportingManager?.fullName || "-" },
        { title: "Employment Type", dataIndex: "employmentType", key: "employmentType" },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (st: string) => <Tag color={st === "Active" ? "green" : st === "Probation" ? "gold" : "volcano"}>{st}</Tag>,
        },
      ];

    case "attendance":
      return [
        { title: "Date", dataIndex: "attendanceDate", key: "date" },
        employeeCol,
        departmentCol,
        { title: "Clock In", dataIndex: "clockInTime", key: "in", render: (t: string) => t || "-" },
        { title: "Clock Out", dataIndex: "clockOutTime", key: "out", render: (t: string) => t || "-" },
        { title: "Work Hours", dataIndex: "workHours", key: "hours", render: (h: number) => h || "-" },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (st: string) => <Tag color={st === "Present" ? "green" : st === "Late" ? "orange" : st === "OnLeave" ? "blue" : "volcano"}>{st}</Tag>,
        },
        {
          title: "Source",
          dataIndex: "punchSource",
          key: "source",
          render: (s: string) => <Tag color={s === "BiometricDevice" ? "cyan" : "default"}>{s === "BiometricDevice" ? "Hardware" : s === "WebManual" ? "Manual" : s || "-"}</Tag>,
        },
      ];

    case "employee-attendance":
      return [
        employeeCol,
        departmentCol,
        { title: "Days", dataIndex: "totalDays", key: "days" },
        { title: "Present", dataIndex: "presentDays", key: "present", render: (v: number) => <Tag color="green">{v}</Tag> },
        { title: "Late", dataIndex: "lateDays", key: "late", render: (v: number) => <Tag color="orange">{v}</Tag> },
        { title: "Leave / Absent", key: "missing", render: (_: any, r: any) => `${r.leaveDays || 0} / ${r.absentDays || 0}` },
        { title: "Work Hours", dataIndex: "totalWorkHours", key: "hours" },
        { title: "Attendance Rate", dataIndex: "attendanceRate", key: "rate", render: (v: number) => <Tag color={v >= 90 ? "green" : v >= 75 ? "orange" : "red"}>{v}%</Tag> },
      ];

    case "department-attendance":
      return [
        { title: "Department", key: "department", render: (_: any, r: any) => <Tag color="blue">{r.department?.name || "Unassigned"}</Tag> },
        { title: "Employees", dataIndex: "employeeCount", key: "employees" },
        { title: "Records", dataIndex: "totalRecords", key: "records" },
        { title: "Present", dataIndex: "presentCount", key: "present", render: (v: number) => <Tag color="green">{v}</Tag> },
        { title: "Late", dataIndex: "lateCount", key: "late", render: (v: number) => <Tag color="orange">{v}</Tag> },
        { title: "Leave / Absent", key: "missing", render: (_: any, r: any) => `${r.leaveCount || 0} / ${r.absentCount || 0}` },
        { title: "Work Hours", dataIndex: "totalWorkHours", key: "hours" },
        { title: "Attendance Rate", dataIndex: "attendanceRate", key: "rate", render: (v: number) => <Tag color={v >= 90 ? "green" : v >= 75 ? "orange" : "red"}>{v}%</Tag> },
      ];

    case "leave":
      return [
        employeeCol,
        departmentCol,
        { title: "Leave Type", key: "leaveType", render: (_: any, r: any) => r.leaveType?.name || "-" },
        {
          title: "Date Range",
          key: "dates",
          render: (_: any, r: any) => (
            <span className="text-xs">
              {r.startDate} ~ {r.endDate} <Tag className="ml-1">{r.daysCount}d</Tag>
            </span>
          ),
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (st: string) => <Tag color={st === "Approved" ? "green" : st === "Rejected" ? "volcano" : "orange"}>{st}</Tag>,
        },
        { title: "Reason", dataIndex: "reason", key: "reason", render: (r: string) => <span className="text-xs max-w-xs block truncate">{r}</span> },
      ];

    case "payroll":
    case "salary":
      return [
        {
          title: "Period",
          key: "period",
          render: (_: any, r: any) => r.payrollSheet ? `${MONTH_NAMES[r.payrollSheet.month]} ${r.payrollSheet.year}` : "-",
        },
        employeeCol,
        departmentCol,
        { title: "Basic Salary", dataIndex: "basicSalary", key: "basic", render: (v: number) => `৳${Number(v).toLocaleString()}` },
        { title: "Allowances", dataIndex: "totalAllowances", key: "allow", render: (v: number) => `৳${Number(v).toLocaleString()}` },
        {
          title: "Deductions",
          key: "deductions",
          render: (_: any, r: any) => `৳${(Number(r.unpaidLeaveDeductions || 0) + Number(r.taxDeductions || 0)).toLocaleString()}`,
        },
        { title: "Net Salary", dataIndex: "netSalary", key: "net", render: (v: number) => <span className="font-bold text-emerald-700">৳{Number(v).toLocaleString()}</span> },
        {
          title: "Payment Status",
          dataIndex: "paymentStatus",
          key: "paymentStatus",
          render: (st: string) => <Tag color={st === "Paid" ? "green" : "orange"}>{st}</Tag>,
        },
      ];

    case "overtime":
      return [
        { title: "Date", dataIndex: "overtimeDate", key: "date" },
        employeeCol,
        departmentCol,
        { title: "Requested Hrs", dataIndex: "requestedHours", key: "reqHrs" },
        { title: "Approved Hrs", dataIndex: "approvedHours", key: "apprHrs" },
        { title: "Amount", dataIndex: "overtimeAmount", key: "amount", render: (v: number) => `৳${Number(v || 0).toLocaleString()}` },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (st: string) => <Tag color={st === "Approved" ? "green" : st === "Rejected" ? "volcano" : st === "Paid" ? "blue" : "orange"}>{st}</Tag>,
        },
      ];

    case "recruitment":
      return [
        { title: "Candidate", dataIndex: "candidateName", key: "candidate" },
        { title: "Job Opening", key: "job", render: (_: any, r: any) => r.jobOpening?.title || "-" },
        {
          title: "Stage",
          dataIndex: "stage",
          key: "stage",
          render: (st: string) => <Tag color={st === "Hired" ? "green" : st === "Rejected" ? "volcano" : "blue"}>{st}</Tag>,
        },
        { title: "Applied On", dataIndex: "createdAt", key: "applied", render: (d: string) => (d ? dayjs(d).format("YYYY-MM-DD") : "-") },
      ];

    case "training":
      return [
        employeeCol,
        departmentCol,
        { title: "Training Program", key: "program", render: (_: any, r: any) => r.trainingProgram?.title || "-" },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (st: string) => <Tag color={st === "Completed" ? "green" : st === "Cancelled" ? "volcano" : "blue"}>{st}</Tag>,
        },
      ];

    default:
      return [];
  }
}

function flattenRowForExport(reportType: string, r: any): Record<string, any> {
  switch (reportType) {
    case "employee-summary":
      return {
        EmployeeCode: r.employeeCode,
        Name: r.fullName,
        Department: r.department?.name,
        Designation: r.designation?.name,
        ReportingManager: r.reportingManager?.fullName,
        EmploymentType: r.employmentType,
        Status: r.status,
      };
    case "attendance":
      return {
        Date: r.attendanceDate,
        Employee: r.employee?.fullName,
        Department: r.employee?.department?.name,
        ClockIn: r.clockInTime,
        ClockOut: r.clockOutTime,
        WorkHours: r.workHours,
        Status: r.status,
        Source: r.punchSource,
      };
    case "employee-attendance":
      return { Employee: r.employee?.fullName, EmployeeCode: r.employee?.employeeCode, Department: r.employee?.department?.name, Days: r.totalDays, Present: r.presentDays, Late: r.lateDays, LeaveDays: r.leaveDays, AbsentDays: r.absentDays, WorkHours: r.totalWorkHours, AttendanceRate: `${r.attendanceRate}%` };
    case "department-attendance":
      return { Department: r.department?.name || "Unassigned", Employees: r.employeeCount, Records: r.totalRecords, Present: r.presentCount, Late: r.lateCount, Leave: r.leaveCount, Absent: r.absentCount, WorkHours: r.totalWorkHours, AttendanceRate: `${r.attendanceRate}%` };
    case "leave":
      return {
        Employee: r.employee?.fullName,
        Department: r.employee?.department?.name,
        LeaveType: r.leaveType?.name,
        StartDate: r.startDate,
        EndDate: r.endDate,
        Days: r.daysCount,
        Status: r.status,
        Reason: r.reason,
      };
    case "payroll":
    case "salary":
      return {
        Period: r.payrollSheet ? `${MONTH_NAMES[r.payrollSheet.month]} ${r.payrollSheet.year}` : "",
        Employee: r.employee?.fullName,
        Department: r.employee?.department?.name,
        BasicSalary: r.basicSalary,
        Allowances: r.totalAllowances,
        Deductions: Number(r.unpaidLeaveDeductions || 0) + Number(r.taxDeductions || 0),
        NetSalary: r.netSalary,
        PaymentStatus: r.paymentStatus,
      };
    case "overtime":
      return {
        Date: r.overtimeDate,
        Employee: r.employee?.fullName,
        Department: r.employee?.department?.name,
        RequestedHours: r.requestedHours,
        ApprovedHours: r.approvedHours,
        Amount: r.overtimeAmount,
        Status: r.status,
      };
    case "recruitment":
      return {
        Candidate: r.candidateName,
        JobOpening: r.jobOpening?.title,
        Stage: r.stage,
        AppliedOn: r.createdAt,
      };
    case "training":
      return {
        Employee: r.employee?.fullName,
        Department: r.employee?.department?.name,
        Program: r.trainingProgram?.title,
        Status: r.status,
      };
    default:
      return r;
  }
}
