"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import dayjs, { Dayjs } from "dayjs";
import { Alert, Badge, Button, Calendar, Card, Col, DatePicker, Descriptions, Empty, Form, Input, List, Modal, Progress, Row, Select, Space, Spin, Statistic, Tag, message } from "antd";
import { ApartmentOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, FundOutlined, GiftOutlined, LaptopOutlined, MoneyCollectOutlined, NotificationOutlined, RiseOutlined, SafetyCertificateOutlined, SolutionOutlined, SwapOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useApplySelfServiceLeaveMutation, useClockInMutation, useClockOutMutation, useGetLeaveTypesQuery, useGetOfficesQuery, useGetSelfServiceProfileQuery, useGetSelfServiceWorkspaceQuery, useRequestSelfServiceExpenseMutation, useRequestSelfServiceLoanMutation, useRequestSelfServiceOvertimeMutation } from "@/redux/api/hrPayrollApi";

const monthLabel = new Intl.DateTimeFormat("en", { month: "short" });
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const AttendanceLocationMap = dynamic(() => import("@/components/attendance/AttendanceLocationMap"), { ssr: false });

export default function EmployeeDashboard() {
  const [calendarDate, setCalendarDate] = useState(dayjs());
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [correctionDetail, setCorrectionDetail] = useState<any>(null);
  const [leaveDetail, setLeaveDetail] = useState<any>(null);
  const [requestForm] = Form.useForm();
  const [punchMode, setPunchMode] = useState<"in" | "out" | null>(null);
  const [punchLocation, setPunchLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [leaveForm] = Form.useForm();
  const { data, isLoading } = useGetSelfServiceProfileQuery(undefined);
  const { data: workspaceData } = useGetSelfServiceWorkspaceQuery(undefined);
  const { data: leaveTypesData } = useGetLeaveTypesQuery(undefined);
  const { data: officesData } = useGetOfficesQuery(undefined);
  const [applyLeave, { isLoading: isApplyingLeave }] = useApplySelfServiceLeaveMutation();
  const [clockIn, { isLoading: clockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: clockingOut }] = useClockOutMutation();
  const [requestLoan, { isLoading: requestingLoan }] = useRequestSelfServiceLoanMutation();
  const [requestExpense, { isLoading: requestingExpense }] = useRequestSelfServiceExpenseMutation();
  const [requestOvertime, { isLoading: requestingOvertime }] = useRequestSelfServiceOvertimeMutation();
  const self = data?.data || {};
  const employee = self.employee;
  const attendance = self.attendance || [];
  const balances = self.leaveBalances || [];
  const holidays = self.holidays || [];
  const workspace = workspaceData?.data || {};
  const leaveTypes = leaveTypesData?.data || [];
  const assignedOffice = (officesData?.data || []).find((office: any) => office.id === employee?.officeId) || employee?.office;
  const officeLat = Number(assignedOffice?.latitude); const officeLng = Number(assignedOffice?.longitude);
  const hasOfficeCoordinates = Number.isFinite(officeLat) && Number.isFinite(officeLng);
  const distanceFromOffice = punchLocation && hasOfficeCoordinates ? 6371000 * 2 * Math.atan2(Math.sqrt(Math.sin(((punchLocation.latitude - officeLat) * Math.PI / 180) / 2) ** 2 + Math.cos(officeLat * Math.PI / 180) * Math.cos(punchLocation.latitude * Math.PI / 180) * Math.sin(((punchLocation.longitude - officeLng) * Math.PI / 180) / 2) ** 2), Math.sqrt(1 - (Math.sin(((punchLocation.latitude - officeLat) * Math.PI / 180) / 2) ** 2 + Math.cos(officeLat * Math.PI / 180) * Math.cos(punchLocation.latitude * Math.PI / 180) * Math.sin(((punchLocation.longitude - officeLng) * Math.PI / 180) / 2) ** 2))) : null;
  const insideOfficeRange = !!punchLocation && hasOfficeCoordinates && distanceFromOffice !== null && distanceFromOffice <= Number(assignedOffice?.radiusMeters || 100);
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

  const submitLeave = async (values: any) => {
    const [start, end] = values.dates || [];
    try {
      await applyLeave({ leaveTypeId: values.leaveTypeId, startDate: start.format("YYYY-MM-DD"), endDate: end.format("YYYY-MM-DD"), daysCount: end.diff(start, "day") + 1, reason: values.reason, emergencyPhone: values.emergencyPhone }).unwrap();
      message.success("Leave application submitted for approval"); leaveForm.resetFields(); setLeaveOpen(false);
    } catch (error: any) { message.error(error?.data?.message || "Could not submit leave application"); }
  };
  const openPunch = (mode: "in" | "out") => {
    if (!employee?.id) return message.error("Your ERP user is not linked to an employee profile");
    if (!navigator.geolocation) return message.error("Location is not available in this browser");
    if (!hasOfficeCoordinates) return message.error("HR has not assigned an office map location and attendance radius to your profile");
    navigator.geolocation.getCurrentPosition(({ coords }) => { setPunchLocation({ latitude: coords.latitude, longitude: coords.longitude }); setPunchMode(mode); }, () => message.error("Allow precise location permission to record attendance"), { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  };
  const confirmPunch = async () => { if (!punchMode || !punchLocation) return; try { await (punchMode === "in" ? clockIn : clockOut)({ employeeId: employee.id, ...punchLocation, source: "Web" }).unwrap(); message.success(punchMode === "in" ? "Check-in recorded successfully" : "Check-out recorded successfully"); setPunchMode(null); setPunchLocation(null); } catch (error: any) { message.error(error?.data?.message || "Attendance could not be recorded"); } };
  const submitRequest = async (values: any) => { try { if (values.type === "loan") await requestLoan({ loanType: values.loanType, principalAmount: Number(values.amount), totalInstallments: Number(values.installments), reason: values.reason }).unwrap(); if (values.type === "expense") await requestExpense({ category: values.category, expenseDate: values.date.format("YYYY-MM-DD"), amount: Number(values.amount), description: values.reason, receiptUrl: values.receiptUrl }).unwrap(); if (values.type === "overtime") await requestOvertime({ overtimeDate: values.date.format("YYYY-MM-DD"), requestedHours: Number(values.hours), reason: values.reason }).unwrap(); message.success("Request submitted for approval"); requestForm.resetFields(); setRequestOpen(false); } catch (error: any) { message.error(error?.data?.message || "Could not submit request"); } };

  if (isLoading) return <div className="p-6 flex justify-center"><Spin /></div>;

  return <div className="p-6 space-y-6">
    <GbHeader title="My Dashboard" />
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-emerald-700">Welcome back</p><h1 className="text-2xl font-bold text-slate-900 mt-1">{employee?.fullName || "Employee"}</h1><p className="mt-2 text-sm text-slate-600">Here is your attendance and leave overview.</p></div><Space wrap><Button type="primary" loading={clockingIn} onClick={() => openPunch("in")}>Check in</Button><Button loading={clockingOut} onClick={() => openPunch("out")}>Check out</Button><Button onClick={() => setLeaveOpen(true)}>Apply for leave</Button><Button onClick={() => setRequestOpen(true)}>New request</Button></Space></div>
    </div>
    <Card title="Employee self-service" className="rounded-xl border border-slate-200 shadow-sm" extra={<span className="text-xs text-slate-500">Your own HR records</span>}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <ServiceShortcut icon={<CalendarOutlined />} label="Attendance" detail={`${attendance.length} records`} />
        <ServiceShortcut icon={<FileTextOutlined />} label="Leave" detail={`${leaveRemaining} days left`} />
        <ServiceShortcut icon={<MoneyCollectOutlined />} label="Payslips" detail={`${(workspace.payroll || []).length} available`} />
        <ServiceShortcut icon={<FundOutlined />} label="Loan & advance" detail={`${(workspace.loans || []).length} requests`} />
        <ServiceShortcut icon={<GiftOutlined />} label="Expense claims" detail={`${(workspace.expenses || []).length} claims`} />
        <ServiceShortcut icon={<ClockCircleOutlined />} label="Overtime" detail={`${(workspace.overtime || []).length} requests`} />
        <ServiceShortcut icon={<LaptopOutlined />} label="My assets" detail={`${(workspace.assets || []).length} assigned`} />
        <ServiceShortcut icon={<SafetyCertificateOutlined />} label="Documents" detail={`${(workspace.documents || []).length} files`} />
        <ServiceShortcut icon={<SolutionOutlined />} label="Training" detail={`${(workspace.training || []).length} enrolled`} />
        <ServiceShortcut icon={<RiseOutlined />} label="Performance" detail={`${(workspace.reviews || []).length} reviews`} />
        <ServiceShortcut icon={<SwapOutlined />} label="Transfers" detail={`${(workspace.transfers || []).length} updates`} />
        <ServiceShortcut icon={<NotificationOutlined />} label="Notices" detail={`${(workspace.announcements || []).length} published`} />
      </div>
    </Card>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><ClockCircleOutlined className="text-2xl text-emerald-600" /><div><p className="text-xs text-slate-500 mb-1">Today&apos;s Working Period</p><b className="text-slate-800">{todayAttendance?.workHours ? `${todayAttendance.workHours} hours` : "Not recorded"}</b></div></div></Card></Col>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><CalendarOutlined className="text-2xl text-blue-600" /><div><p className="text-xs text-slate-500 mb-1">General Schedule</p><b className="text-slate-800">{employee?.shift?.startTime || "09:00 AM"} – {employee?.shift?.endTime || "06:00 PM"}</b></div></div></Card></Col>
      <Col xs={24} md={8}><Card size="small" className="border border-slate-200"><div className="flex gap-3 items-center"><FileTextOutlined className="text-2xl text-violet-600" /><div><p className="text-xs text-slate-500 mb-1">Leave Balance</p><b className="text-slate-800">{leaveRemaining} days remaining</b></div></div></Card></Col>
    </Row>
    <Card title="My leave requests" className="rounded-xl border border-slate-200 shadow-sm"><List dataSource={self.leaves || []} locale={{ emptyText: "No leave request yet" }} renderItem={(leave: any) => <List.Item><div><b>{leave.leaveType?.name || "Leave"}</b><p className="mb-0 mt-1 text-xs text-slate-500">{leave.startDate} → {leave.endDate} · {leave.daysCount} day(s) · {leave.status === "Pending" ? `Pending with ${leave.approvalInfo?.currentWith?.name || (leave.approvalStage === "PendingDeptHead" ? "Department Head" : "Final Approver")}` : leave.status === "Approved" ? "Final approved" : "Rejected"}</p></div><Space><Button size="small" onClick={() => setLeaveDetail(leave)}>Details</Button><Tag color={leave.status === "Approved" ? "green" : leave.status === "Rejected" ? "red" : "gold"}>{leave.status}</Tag></Space></List.Item>} /></Card>
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
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}><SelfServiceList title="Payroll, loans & expenses" empty="No payroll or financial self-service record" groups={[{ label: "Payslip", items: workspace.payroll, primary: (x: any) => `${x.payrollSheet?.monthName || "Payroll"} ${x.payrollSheet?.year || ""}`, secondary: (x: any) => `Net salary: ${x.netSalary ?? "—"} · ${x.paymentStatus || "Pending"}` }, { label: "Loan / advance", items: workspace.loans, primary: (x: any) => x.loanType || "Loan request", secondary: (x: any) => `${x.principalAmount ?? "—"} · ${x.status || "Pending"}` }, { label: "Expense", items: workspace.expenses, primary: (x: any) => x.category || x.title || "Expense claim", secondary: (x: any) => `${x.amount ?? "—"} · ${x.status || "Pending"}` }]} /></Col>
      <Col xs={24} lg={12}><SelfServiceList title="Work requests" empty="No overtime, transfer or regularization record" onCorrectionDetail={setCorrectionDetail} groups={[{ label: "Overtime", items: workspace.overtime, primary: (x: any) => x.overtimeDate || "Overtime request", secondary: (x: any) => `${x.requestedHours || 0} hours · ${x.status || "Pending"}` }, { label: "Transfer", items: workspace.transfers, primary: (x: any) => x.toDepartment?.name || "Transfer request", secondary: (x: any) => x.status || "Pending" }, { label: "Attendance correction", items: workspace.corrections, primary: (x: any) => x.attendanceDate || "Correction request", secondary: (x: any) => x.status || "Pending" }]} /></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}><SelfServiceList title="Career & company resources" empty="No asset, document, training or review record" groups={[{ label: "Asset", items: workspace.assets, primary: (x: any) => x.assetName || x.name || "Assigned asset", secondary: (x: any) => x.status || "Assigned" }, { label: "Document", items: workspace.documents, primary: (x: any) => x.documentName || x.documentType || "Employee document", secondary: (x: any) => x.status || "Available" }, { label: "Training", items: workspace.training, primary: (x: any) => x.trainingProgram?.title || x.trainingProgram?.name || "Training enrollment", secondary: (x: any) => x.status || "Enrolled" }, { label: "Performance", items: workspace.reviews, primary: (x: any) => x.reviewPeriod || x.cycle || "Performance review", secondary: (x: any) => x.status || "In progress" }]} /></Col>
      <Col xs={24} lg={12}><Card title="Company notices & reporting"><div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3"><ApartmentOutlined className="text-xl text-blue-600" /><div><p className="m-0 font-semibold">{employee?.reportingManager?.fullName || "No supervisor assigned"}</p><p className="m-0 text-xs text-slate-500">Reporting manager</p></div></div><List size="small" dataSource={(workspace.announcements || []).slice(0, 5)} locale={{ emptyText: "No active announcements" }} renderItem={(item: any) => <List.Item><div><b>{item.title || "Announcement"}</b><p className="mb-0 mt-1 text-xs text-slate-500">{item.message || item.description || "Company update"}</p></div></List.Item>} /></Card></Col>
    </Row>
    <Modal title="Apply for leave" open={leaveOpen} onCancel={() => setLeaveOpen(false)} footer={null} destroyOnClose>
      <Form form={leaveForm} layout="vertical" onFinish={submitLeave}>
        <Form.Item name="leaveTypeId" label="Leave type" rules={[{ required: true, message: "Select a leave type" }]}><Select options={leaveTypes.map((item: any) => ({ value: item.id, label: item.name }))} /></Form.Item>
        <Form.Item name="dates" label="Date range" rules={[{ required: true, message: "Select leave dates" }]}><RangePicker className="w-full" disabledDate={(date) => date && date < dayjs().startOf("day")} /></Form.Item>
        <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Enter a reason" }]}><TextArea rows={3} /></Form.Item>
        <Form.Item name="emergencyPhone" label="Emergency phone"><Input /></Form.Item>
        <Space className="flex justify-end"><Button onClick={() => setLeaveOpen(false)}>Cancel</Button><Button htmlType="submit" type="primary" loading={isApplyingLeave}>Submit application</Button></Space>
      </Form>
    </Modal>
    <Modal title={punchMode === "in" ? "Confirm check-in" : "Confirm check-out"} open={!!punchMode} onCancel={() => { setPunchMode(null); setPunchLocation(null); }} footer={null} destroyOnClose>
      {punchLocation && <><div className="h-64 overflow-hidden rounded-xl border border-slate-200"><AttendanceLocationMap office={assignedOffice} employeeLocation={punchLocation} isInsideRange={insideOfficeRange} /></div><Alert className="mt-4" type={insideOfficeRange ? "success" : "error"} showIcon message={insideOfficeRange ? "You are inside the permitted office radius" : "You are outside the permitted office radius"} description={`${assignedOffice?.name || "Assigned office"} radius: ${assignedOffice?.radiusMeters || 100}m · Your distance: ${Math.round(distanceFromOffice || 0)}m`} /><p className="mt-3 text-xs text-slate-500">Your location: {punchLocation.latitude.toFixed(6)}, {punchLocation.longitude.toFixed(6)}</p><Space className="mt-3 flex justify-end"><Button onClick={() => { setPunchMode(null); setPunchLocation(null); }}>Cancel</Button><Button type="primary" disabled={!insideOfficeRange} loading={clockingIn || clockingOut} onClick={confirmPunch}>Confirm {punchMode === "in" ? "check-in" : "check-out"}</Button></Space></>}
    </Modal>
    <Modal title="New employee request" open={requestOpen} onCancel={() => setRequestOpen(false)} footer={null} destroyOnClose><Form form={requestForm} layout="vertical" onFinish={submitRequest}><Form.Item name="type" label="Request type" rules={[{ required: true }]}><Select options={[{ value: "loan", label: "Loan / salary advance" }, { value: "expense", label: "Expense claim" }, { value: "overtime", label: "Overtime" }]} /></Form.Item><Form.Item noStyle shouldUpdate={(a,b) => a.type !== b.type}>{() => <>{requestForm.getFieldValue("type") === "loan" && <><Form.Item name="loanType" label="Loan type" rules={[{ required: true }]}><Select options={["Salary Advance", "Company Loan", "Emergency Fund"].map(value => ({ value, label: value }))} /></Form.Item><Form.Item name="installments" label="Installments" rules={[{ required: true }]}><Input type="number" min="1" /></Form.Item></>}{requestForm.getFieldValue("type") !== "loan" && <Form.Item name="date" label="Date" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>}{requestForm.getFieldValue("type") === "expense" && <Form.Item name="category" label="Expense category" rules={[{ required: true }]}><Input /></Form.Item>}{requestForm.getFieldValue("type") === "overtime" && <Form.Item name="hours" label="Requested hours" rules={[{ required: true }]}><Input type="number" min="0.5" step="0.5" /></Form.Item>}{requestForm.getFieldValue("type") !== "overtime" && <Form.Item name="amount" label="Amount" rules={[{ required: true }]}><Input type="number" min="1" /></Form.Item>}<Form.Item name="reason" label="Reason / description" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item><Form.Item name="receiptUrl" label="Receipt URL (optional)"><Input /></Form.Item></>}</Form.Item><Space className="flex justify-end"><Button onClick={() => setRequestOpen(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={requestingLoan || requestingExpense || requestingOvertime}>Submit request</Button></Space></Form></Modal>
    <Modal title="Attendance correction details" open={!!correctionDetail} onCancel={() => setCorrectionDetail(null)} footer={<Button onClick={() => setCorrectionDetail(null)}>Close</Button>}><Descriptions column={1} size="small" bordered><Descriptions.Item label="Attendance date">{correctionDetail?.attendanceDate}</Descriptions.Item><Descriptions.Item label="Requested in / out">{correctionDetail?.requestedClockIn || "—"} / {correctionDetail?.requestedClockOut || "—"}</Descriptions.Item><Descriptions.Item label="Reason">{correctionDetail?.reason}</Descriptions.Item></Descriptions><div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><ApprovalStatus label="Department Head" person={correctionDetail?.approvalInfo?.departmentHead} completed={!!correctionDetail?.deptHeadApprovedById} pending={correctionDetail?.status === "Pending" && correctionDetail?.approvalStage === "PendingDeptHead"} completedLabel="Recommended" completedAt={correctionDetail?.deptHeadActionAt} /><ApprovalStatus label="Final Approver" person={correctionDetail?.approvalInfo?.finalApprover} completed={correctionDetail?.status === "Approved" && !!correctionDetail?.approvedById} pending={correctionDetail?.status === "Pending" && correctionDetail?.approvalStage !== "PendingDeptHead"} completedLabel="Approved" completedAt={correctionDetail?.approvedAt} last /></div></Modal>
    <Modal title="Leave request details" open={!!leaveDetail} onCancel={() => setLeaveDetail(null)} footer={<Button onClick={() => setLeaveDetail(null)}>Close</Button>}><div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="m-0 text-xs font-semibold uppercase tracking-wider text-blue-600">{leaveDetail?.leaveType?.name || "Leave"}</p><h3 className="mb-1 mt-1 text-lg font-bold text-slate-900">{leaveDetail?.startDate} → {leaveDetail?.endDate}</h3><p className="m-0 text-sm text-slate-600">{leaveDetail?.daysCount} day(s) · {leaveDetail?.reason || "No reason provided"}</p></div><Tag className="!m-0 !rounded-full !px-3 !py-1" color={leaveDetail?.status === "Approved" ? "green" : leaveDetail?.status === "Rejected" ? "red" : "gold"}>{leaveDetail?.status}</Tag></div></div><div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Approval progress</p><ApprovalStatus label="Department Head" person={leaveDetail?.approvalInfo?.departmentHeadApprovedBy || leaveDetail?.approvalInfo?.departmentHead} completed={!!leaveDetail?.deptHeadApprovedById} pending={leaveDetail?.status === "Pending" && leaveDetail?.approvalStage === "PendingDeptHead"} completedLabel="Recommended" completedAt={leaveDetail?.deptHeadActionAt} /><ApprovalStatus label="Final Approver" person={leaveDetail?.approvalInfo?.finalApprovedBy || leaveDetail?.approvalInfo?.finalApprover} completed={leaveDetail?.status === "Approved" && !!leaveDetail?.approvedById} pending={leaveDetail?.status === "Pending" && leaveDetail?.approvalStage !== "PendingDeptHead"} completedLabel="Approved" completedAt={leaveDetail?.approvedAt} last /></div>{leaveDetail?.approvalRemarks && <Alert className="mt-4" type={leaveDetail.status === "Rejected" ? "error" : "info"} message="Approver remarks" description={leaveDetail.approvalRemarks} />}</Modal>
  </div>;
}

function ServiceShortcut({ icon, label, detail }: any) { return <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="text-lg text-blue-600">{icon}</div><p className="mb-0 mt-2 text-sm font-semibold text-slate-800">{label}</p><p className="mb-0 mt-1 text-xs text-slate-500">{detail}</p></div>; }
function SelfServiceList({ title, groups, empty, onCorrectionDetail }: any) { const rows = groups.flatMap((group: any) => (group.items || []).slice(0, 3).map((item: any, index: number) => ({ ...item, _key: `${group.label}-${item.id || index}`, _label: group.label, _primary: group.primary(item), _secondary: group.secondary(item) }))); return <Card title={title}><List size="small" dataSource={rows} locale={{ emptyText: empty }} renderItem={(item: any) => <List.Item><div className="min-w-0"><span className="mr-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">{item._label}</span><b className="text-sm">{item._primary}</b><p className="mb-0 mt-1 truncate text-xs text-slate-500">{item._secondary}</p></div><Space>{item._label === "Attendance correction" && <Button size="small" onClick={() => onCorrectionDetail?.(item)}>Details</Button>}<Tag color={String(item.status || "").toLowerCase() === "approved" || String(item.paymentStatus || "").toLowerCase() === "paid" ? "green" : "gold"}>{item.status || item.paymentStatus || "Available"}</Tag></Space></List.Item>} /></Card>; }
function ApprovalStatus({ label, person, pending, completed, completedLabel, completedAt, last = false }: any) { return <div className="relative flex gap-3 pb-5 last:pb-0"><div className="relative flex w-6 justify-center"><span className={`z-10 grid h-6 w-6 place-items-center rounded-full border-2 text-xs font-bold ${completed ? "border-emerald-500 bg-emerald-500 text-white" : pending ? "border-amber-400 bg-amber-50 text-amber-600" : "border-slate-300 bg-slate-100 text-slate-400"}`}>{completed ? "✓" : pending ? "…" : ""}</span>{!last && <span className={`absolute top-6 h-[calc(100%-12px)] w-px ${completed ? "bg-emerald-300" : "bg-slate-200"}`} />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><b className="text-sm text-slate-800">{label}</b><Tag className="!m-0 !rounded-full" color={completed ? "green" : pending ? "gold" : "default"}>{completed ? completedLabel : pending ? "Pending" : "Not started"}</Tag></div><p className="mb-0 mt-1 text-sm font-medium text-slate-700">{person?.name || `${label} not configured`}</p><p className="m-0 text-xs text-slate-500">{person?.title || (pending ? "Awaiting decision" : "Inactive until previous approval")}{completedAt ? ` · ${dayjs(completedAt).format("DD MMM YYYY, h:mm A")}` : ""}</p></div></div>; }

function leavesForDate(leaves: any[], date: string) {
  return leaves.find((leave) => leave.status === "Approved" && String(leave.startDate).slice(0, 10) <= date && String(leave.endDate).slice(0, 10) >= date);
}
function holidaysForDate(holidays: any[], date: string) { return holidays.find((holiday) => String(holiday.fromDate).slice(0, 10) <= date && String(holiday.toDate).slice(0, 10) >= date); }
