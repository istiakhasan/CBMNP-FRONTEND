"use client";

import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Badge, Calendar, Card, Col, Empty, List, Progress, Row, Select, Spin, Statistic, Tag } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useGetSelfServiceProfileQuery } from "@/redux/api/hrPayrollApi";

const monthLabel = new Intl.DateTimeFormat("en", { month: "short" });

export default function EmployeeDashboard() {
  const [calendarDate, setCalendarDate] = useState(dayjs());
  const { data, isLoading } = useGetSelfServiceProfileQuery(undefined);
  const self = data?.data || {};
  const employee = self.employee;
  const attendance = self.attendance || [];
  const balances = self.leaveBalances || [];
  const holidays = self.holidays || [];
  const year = calendarDate.year();
  const monthRows = Array.from({ length: 12 }, (_, month) => {
    const present = attendance.filter((row: any) => {
      const date = new Date(row.attendanceDate);
      return date.getFullYear() === year && date.getMonth() === month && ["Present", "Late"].includes(row.status);
    }).length;
    return { label: monthLabel.format(new Date(year, month, 1)), present };
  });
  const maxPresent = Math.max(...monthRows.map((item) => item.present), 1);
  const currentMonth = calendarDate.month();
  const presentThisMonth = monthRows[currentMonth].present;
  const leaveAllowed = balances.reduce((sum: number, row: any) => sum + Number(row.totalAllowed || 0), 0);
  const leaveRemaining = balances.reduce((sum: number, row: any) => sum + Number(row.remainingDays || 0), 0);
  const todayKey = dayjs().format("YYYY-MM-DD");
  const todayAttendance: any = attendance.find((row: any) => String(row.attendanceDate).slice(0, 10) === todayKey);
  const attendanceByDate = new Map(attendance.map((row: any) => [String(row.attendanceDate).slice(0, 10), row]));
  const leaveForDate = (date: Dayjs) => leavesForDate(self.leaves || [], date.format("YYYY-MM-DD"));
  const holidayForDate = (date: Dayjs) => holidaysForDate(holidays, date.format("YYYY-MM-DD"));
  const renderCalendarCell = (date: Dayjs) => {
    const dateKey = date.format("YYYY-MM-DD");
    const record: any = attendanceByDate.get(dateKey);
    const leave = leaveForDate(date);
    if (leave) return <div className="mt-1"><Badge color={leave.status === "Approved" ? "#8b5cf6" : "#f59e0b"} text={<span className="text-xs">{leave.leaveType?.name || "Leave"}</span>} /></div>;
    if (record) return <div className="mt-1"><Badge color={record.status === "Late" ? "#f59e0b" : "#10b981"} text={<span className="text-xs">{record.status}</span>} /></div>;
    return null;
  };
  const renderFullCalendarCell = (date: Dayjs, info: any) => {
    if (info.type !== "date") return info.originNode;
    const record: any = attendanceByDate.get(date.format("YYYY-MM-DD"));
    const leave = leaveForDate(date);
    const holiday = holidayForDate(date);
    const isFuture = date.isAfter(dayjs(), "day");
    const weeklyOffDays = employee?.department?.weeklyOffDays?.length ? employee.department.weeklyOffDays : [5];
    const isWeekend = weeklyOffDays.includes(date.day());
    const label = record?.status === "Present" ? "Present" : record?.status === "Late" ? "Late" : leave ? (leave.leaveType?.name || "Leave") : holiday ? holiday.name : isWeekend ? "Off day" : !isFuture ? "Absent" : "";
    const pillClass = record?.status === "Present" ? "bg-emerald-100 text-emerald-700" : record?.status === "Late" ? "bg-amber-100 text-amber-700" : leave ? "bg-violet-100 text-violet-700" : holiday ? "bg-sky-100 text-sky-700" : isWeekend ? "bg-slate-100 text-slate-500" : "bg-rose-100 text-rose-700";
    const stateClass = record?.status === "Present" ? "bg-emerald-50/70" : leave ? "bg-violet-50/60" : holiday ? "bg-sky-50/70" : "";
    return <div className={`min-h-[84px] rounded-lg p-2 flex flex-col items-center justify-start ${stateClass}`}><span className="font-semibold text-slate-700 leading-5">{date.date()}</span>{label && <span className={`mt-2 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${pillClass}`}>{label}</span>}</div>;
  };

  if (isLoading) return <div className="p-6 flex justify-center"><Spin /></div>;

  return <div className="p-6 space-y-6">
    <GbHeader title="My Dashboard" />
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div><p className="text-sm font-medium text-emerald-700">Welcome back</p><h1 className="text-2xl font-bold text-slate-900 mt-1">{employee?.fullName || "Employee"}</h1><p className="mt-2 text-sm text-slate-600">Here is your attendance and leave overview.</p></div>
    </div>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><ClockCircleOutlined className="text-2xl text-emerald-600" /><div><p className="text-xs text-slate-500 mb-1">Today&apos;s Working Period</p><b className="text-slate-800">{todayAttendance?.workHours ? `${todayAttendance.workHours} hours` : "Not recorded"}</b></div></div></Card></Col>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><CalendarOutlined className="text-2xl text-blue-600" /><div><p className="text-xs text-slate-500 mb-1">General Schedule</p><b className="text-slate-800">{employee?.shift?.startTime || "09:00 AM"} – {employee?.shift?.endTime || "06:00 PM"}</b></div></div></Card></Col>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><FileTextOutlined className="text-2xl text-violet-600" /><div><p className="text-xs text-slate-500 mb-1">Leave Balance</p><b className="text-slate-800">{leaveRemaining} days remaining</b></div></div></Card></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="Present This Month" value={presentThisMonth} suffix="days" prefix={<CheckCircleOutlined className="text-emerald-600" />} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="Attendance Records" value={attendance.length} prefix={<CalendarOutlined className="text-blue-600" />} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="Leave Remaining" value={leaveRemaining} suffix="days" prefix={<ClockCircleOutlined className="text-amber-500" />} /></Card></Col>
      <Col xs={24} sm={12} lg={6}><Card><Statistic title="Leave Used" value={Math.max(leaveAllowed - leaveRemaining, 0)} suffix="days" prefix={<FileTextOutlined className="text-purple-600" />} /></Card></Col>
    </Row>
    <Row gutter={[16, 16]}><Col xs={24} lg={16}><Card title="Attendance Calendar" className="rounded-xl border border-gray-200 shadow-sm" extra={<div className="flex gap-3 text-xs"><span><i className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />Present</span><span><i className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />Late</span><span><i className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-1" />Leave</span></div>}><Calendar className="employee-attendance-calendar" fullscreen={false} value={calendarDate} onPanelChange={setCalendarDate} fullCellRender={renderFullCalendarCell} headerRender={({ value, onChange }) => <div className="flex flex-wrap justify-end gap-2 px-3 py-2"><Select className="w-32" value={value.month()} onChange={(month) => onChange(value.month(month))} options={Array.from({ length: 12 }, (_, month) => ({ value: month, label: dayjs().month(month).format("MMMM") }))} /><Select className="w-24" value={value.year()} onChange={(selectedYear) => onChange(value.year(selectedYear))} options={Array.from({ length: 5 }, (_, index) => ({ value: dayjs().year() - 2 + index, label: String(dayjs().year() - 2 + index) }))} /></div>} /></Card></Col><Col xs={24} lg={8}><Card title="Recent Attendance" className="rounded-xl border border-gray-200 shadow-sm h-full"><List dataSource={attendance.slice(0, 6)} locale={{ emptyText: "No attendance recorded" }} renderItem={(row: any) => <List.Item><div className="w-full"><div className="flex justify-between text-sm"><b>{dayjs(row.attendanceDate).format("DD MMM, YYYY")}</b><Tag color={row.status === "Late" ? "orange" : "green"}>{row.status}</Tag></div><div className="flex justify-between text-xs text-slate-500 mt-1"><span>↑ In: {row.clockInTime || "–"}</span><span>↓ Out: {row.clockOutTime || "–"}</span></div></div></List.Item>} /></Card></Col></Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={15}><Card title={`Monthly Attendance · ${year}`}><div className="h-64 flex items-end gap-2 pt-5">{monthRows.map((item, index) => <div key={item.label} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-2"><span className="text-xs text-slate-500">{item.present || ""}</span><div className={`w-full max-w-8 rounded-t ${index === currentMonth ? "bg-emerald-600" : "bg-emerald-200"}`} style={{ height: `${Math.max(item.present ? (item.present / maxPresent) * 100 : 3, 3)}%` }} /><span className="text-xs text-slate-500">{item.label}</span></div>)}</div></Card></Col>
      <Col xs={24} lg={9}><Card title="Remaining Leave"><div className="space-y-5">{balances.length ? balances.map((balance: any) => { const allowed = Number(balance.totalAllowed || 0); const remaining = Number(balance.remainingDays || 0); return <div key={balance.leaveTypeId || balance.leaveTypeName}><div className="flex justify-between mb-1 text-sm"><span>{balance.leaveTypeName}</span><Tag color="green">{remaining} / {allowed} days</Tag></div><Progress percent={allowed ? Math.round((remaining / allowed) * 100) : 0} showInfo={false} strokeColor="#10b981" /></div>; }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No leave balance configured" />}</div></Card></Col>
    </Row>
  </div>;
}

function leavesForDate(leaves: any[], date: string) {
  return leaves.find((leave) => leave.status !== "Rejected" && String(leave.startDate).slice(0, 10) <= date && String(leave.endDate).slice(0, 10) >= date);
}
function holidaysForDate(holidays: any[], date: string) { return holidays.find((holiday) => String(holiday.fromDate).slice(0, 10) <= date && String(holiday.toDate).slice(0, 10) >= date); }
