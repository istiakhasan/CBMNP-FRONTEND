"use client";

import React from "react";
import { Alert, Button, Card, Col, Empty, Progress, Row, Statistic, Table, Tag } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ReloadOutlined, TeamOutlined, UserDeleteOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetHrDashboardQuery } from "@/redux/api/hrPayrollApi";

const count = (v: unknown) => Number(v || 0);

export default function HrDashboardPage() {
  const { data, isLoading, isError, refetch } = useGetHrDashboardQuery(undefined);
  const dash = data?.data || {};
  // API returns `department` from the aggregate query; normalize it for both chart and table.
  const departments = (dash.departmentBreakdown || []).map((row: any) => ({ name: row.name || row.department || "Unassigned", count: count(row.count) }));
  const active = count(dash.activeEmployees);
  const attendanceRate = active ? Math.round((count(dash.presentToday) / active) * 100) : 0;
  const maxDept = Math.max(...departments.map((row: any) => row.count), 1);
  const actions = [["Leave requests", dash.pendingLeaves, "orange"], ["Attendance corrections", dash.pendingCorrections, "red"], ["Overtime requests", dash.pendingOvertimes, "blue"], ["Pending payroll", dash.pendingPayroll, "purple"]].filter(([, value]) => count(value));

  return <div className="p-6 space-y-6">
    <GbHeader title="HR Dashboard" />
    {isError && <Alert type="error" showIcon message="Failed to load HR dashboard" action={<Button icon={<ReloadOutlined />} onClick={() => refetch()}>Retry</Button>} />}
    <div className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-800 p-6 text-white flex flex-wrap justify-between gap-4"><div><p className="text-indigo-200 text-sm">People operations overview</p><h1 className="text-2xl font-bold mt-1">Workforce command centre</h1><p className="text-sm text-indigo-100 mt-2">Live headcount, attendance and pending HR actions.</p></div><Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh data</Button></div>
    <Row gutter={[16, 16]}>
      <Metric title="Total Employees" value={dash.totalEmployees} note={`${dash.probationEmployees || 0} on probation`} icon={<TeamOutlined />} color="text-blue-600" />
      <Metric title="Present Today" value={dash.presentToday} note={`${attendanceRate}% attendance rate`} icon={<CheckCircleOutlined />} color="text-emerald-600" />
      <Metric title="On Leave Today" value={dash.onLeaveToday} note={`${dash.pendingLeaves || 0} requests pending`} icon={<CalendarOutlined />} color="text-amber-500" />
      <Metric title="Absent Today" value={dash.absentToday} note={`${dash.lateToday || 0} employees late`} icon={<UserDeleteOutlined />} color="text-rose-600" />
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={15}><Card title="Department-wise Active Employees" loading={isLoading} className="rounded-xl border border-gray-200 shadow-sm"><Row gutter={[20, 20]}><Col xs={24} md={11}><div className="space-y-4">{departments.length ? departments.map((row: any) => <div key={row.name}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{row.name}</span><span>{row.count} employees</span></div><Progress percent={Math.round(row.count / maxDept * 100)} showInfo={false} strokeColor="#4f46e5" /></div>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No department data available" />}</div></Col><Col xs={24} md={13}><Table size="small" dataSource={departments} rowKey="name" pagination={false} columns={[{ title: "Department", dataIndex: "name" }, { title: "Active employees", dataIndex: "count", align: "right" as const }]} /></Col></Row></Card></Col>
      <Col xs={24} lg={9}><Card title="Attendance Today" loading={isLoading} className="rounded-xl border border-gray-200 shadow-sm"><div className="text-center"><Progress type="dashboard" percent={attendanceRate} strokeColor="#10b981" /></div><div className="grid grid-cols-2 gap-3 mt-5 text-sm"><Mini label="Present" value={dash.presentToday} /><Mini label="Absent" value={dash.absentToday} /><Mini label="Late" value={dash.lateToday} /><Mini label="On leave" value={dash.onLeaveToday} /></div></Card></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={14}><Card title="Recent Joiners" loading={isLoading} className="rounded-xl border border-gray-200 shadow-sm"><Table size="small" dataSource={dash.recentJoiners || []} rowKey={(r: any) => r.id} pagination={false} columns={[{ title: "Employee", dataIndex: "fullName" }, { title: "Department", render: (_: any, r: any) => <Tag color="blue">{r.department?.name || "General"}</Tag> }, { title: "Designation", render: (_: any, r: any) => r.designation?.name || "-" }, { title: "Joining date", dataIndex: "joiningDate" }]} /></Card></Col>
      <Col xs={24} lg={10}><Card title="Action Centre" loading={isLoading} className="rounded-xl border border-gray-200 shadow-sm"><div className="space-y-3">{actions.length ? actions.map(([label, value, color]: any) => <div key={label} className="flex justify-between rounded-lg bg-slate-50 p-3"><span>{label}</span><Tag color={color}>{value} pending</Tag></div>) : <div className="py-8 text-center text-emerald-600">No pending HR actions</div>}<div className="border-t pt-3 text-sm flex justify-between"><span>Open job positions</span><b>{dash.openJobs || 0}</b></div><div className="text-sm flex justify-between"><span>Pending loans</span><b>{dash.pendingLoans || 0}</b></div></div></Card></Col>
    </Row>
  </div>;
}

function Metric({ title, value, note, icon, color }: any) { return <Col xs={24} sm={12} lg={6}><Card className="rounded-xl border border-gray-200 shadow-sm"><Statistic title={title} value={value || 0} prefix={React.cloneElement(icon, { className: color })} /><p className="text-xs text-slate-500 mt-2">{note}</p></Card></Col>; }
function Mini({ label, value }: any) { return <div className="rounded-lg bg-slate-50 p-3"><b className="block text-lg">{value || 0}</b><span>{label}</span></div>; }
