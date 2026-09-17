"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { Alert, Button, Card, Col, DatePicker, Descriptions, Empty, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag, message } from "antd";
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import { useApplySelfServiceLeaveMutation, useClockInMutation, useClockOutMutation, useGetAttendanceCorrectionsQuery, useGetLeaveTypesQuery, useGetOfficesQuery, useGetSelfServiceProfileQuery, useSubmitSelfServiceAttendanceCorrectionMutation } from "@/redux/api/hrPayrollApi";

const AttendanceLocationMap = dynamic(() => import("@/components/attendance/AttendanceLocationMap"), { ssr: false });

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formatAttendanceTime = (time?: string) => {
  if (!time) return "—";
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${((hours + 11) % 12) + 1}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const attendanceAppearance = (status?: string) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "present") return { stripe: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", label: "P" };
  if (normalized === "late") return { stripe: "bg-amber-400", badge: "bg-amber-50 text-amber-700", label: "L" };
  if (normalized === "onleave" || normalized === "leave") return { stripe: "bg-violet-500", badge: "bg-violet-50 text-violet-700", label: "LV" };
  if (normalized === "absent") return { stripe: "bg-rose-500", badge: "bg-rose-50 text-rose-700", label: "A" };
  return { stripe: "bg-slate-400", badge: "bg-slate-100 text-slate-600", label: status?.slice(0, 1).toUpperCase() || "—" };
};

export default function EmployeeProfilePage() {
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [punchMode, setPunchMode] = useState<"in" | "out" | null>(null);
  const [punchLocation, setPunchLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reconciliationOpen, setReconciliationOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [punchForm] = Form.useForm();
  const [form] = Form.useForm();
  const [reconciliationForm] = Form.useForm();
  const { data: profileData, isLoading, refetch } = useGetSelfServiceProfileQuery(undefined);
  const { data: leaveTypesData } = useGetLeaveTypesQuery(undefined);
  const { data: officesData } = useGetOfficesQuery(undefined);
  const [applyLeave, { isLoading: isApplying }] = useApplySelfServiceLeaveMutation();
  const [clockIn, { isLoading: clockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: clockingOut }] = useClockOutMutation();
  const [submitReconciliation, { isLoading: isSubmittingReconciliation }] = useSubmitSelfServiceAttendanceCorrectionMutation();

  const user = profileData?.data?.user || profileData?.data?.profile || null;
  const self = profileData?.data || {};
  const employee = self.employee;
  const attendance = self.attendance || [];
  const leaves = self.leaves || [];
  const balances = self.leaveBalances || [];
  const { data: correctionData, refetch: refetchCorrections } = useGetAttendanceCorrectionsQuery({ employeeId: employee?.id }, { skip: !employee?.id });
  const corrections = correctionData?.data || [];
  const leaveTypes = leaveTypesData?.data || [];
  const assignedOffice = (officesData?.data || []).find((office: any) => office.id === employee?.officeId);
  const officeLat = Number(assignedOffice?.latitude);
  const officeLng = Number(assignedOffice?.longitude);
  const hasAssignedOfficeLocation = Number.isFinite(officeLat) && Number.isFinite(officeLng);
  const mapLatPadding = 0.0012; const mapLngPadding = 0.0015;
  const currentLeft = 50; const currentTop = 50;
  const locationDistance = hasAssignedOfficeLocation && punchLocation ? 6371000 * 2 * Math.atan2(Math.sqrt(Math.sin(((punchLocation.latitude - officeLat) * Math.PI / 180) / 2) ** 2 + Math.cos(officeLat * Math.PI / 180) * Math.cos(punchLocation.latitude * Math.PI / 180) * Math.sin(((punchLocation.longitude - officeLng) * Math.PI / 180) / 2) ** 2), Math.sqrt(1 - (Math.sin(((punchLocation.latitude - officeLat) * Math.PI / 180) / 2) ** 2 + Math.cos(officeLat * Math.PI / 180) * Math.cos(punchLocation.latitude * Math.PI / 180) * Math.sin(((punchLocation.longitude - officeLng) * Math.PI / 180) / 2) ** 2))) : 0;
  const insideOfficeRange = !assignedOffice || (hasAssignedOfficeLocation && locationDistance <= Number(assignedOffice.radiusMeters || 0));

  const submitLeave = async (values: any) => {
    const [start, end] = values.dates || [];
    try {
      await applyLeave({
        leaveTypeId: values.leaveTypeId,
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        daysCount: end.diff(start, "day") + 1,
        reason: values.reason,
        emergencyPhone: values.emergencyPhone,
      }).unwrap();
      message.success("Leave application submitted");
      form.resetFields();
      setLeaveOpen(false);
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || "Could not submit leave application");
    }
  };
  const openPunch = (type: "in" | "out") => {
    if (!employee?.id || !navigator.geolocation) return message.error("Location is not available in this browser");
    navigator.geolocation.getCurrentPosition(({ coords }) => { setPunchLocation({ latitude: coords.latitude, longitude: coords.longitude }); setPunchMode(type); }, () => message.error("Please allow location permission to record attendance"), { enableHighAccuracy: true, timeout: 15000 });
  };
  const punch = async (values: any) => {
    if (!punchMode || !punchLocation) return;
    try { await (punchMode === "in" ? clockIn : clockOut)({ employeeId: employee.id, ...punchLocation, remarks: values.remarks }).unwrap(); message.success(punchMode === "in" ? "Checked in successfully" : "Checked out successfully"); setPunchMode(null); setPunchLocation(null); punchForm.resetFields(); refetch(); }
    catch (error: any) { message.error(error?.data?.message || "Attendance could not be recorded"); }
  };
  const openReconciliation = (record: any) => {
    setSelectedAttendance(record);
    reconciliationForm.setFieldsValue({ attendanceDate: dayjs(record.attendanceDate), requestedClockIn: record.clockInTime ? dayjs(`2000-01-01 ${record.clockInTime}`) : undefined, requestedClockOut: record.clockOutTime ? dayjs(`2000-01-01 ${record.clockOutTime}`) : undefined, reason: "" });
    setReconciliationOpen(true);
  };
  const submitAttendanceReconciliation = async (values: any) => {
    try {
      await submitReconciliation({ attendanceDate: values.attendanceDate.format("YYYY-MM-DD"), requestedClockIn: values.requestedClockIn?.format("HH:mm:ss"), requestedClockOut: values.requestedClockOut?.format("HH:mm:ss"), reason: values.reason }).unwrap();
      message.success("Attendance reconciliation submitted for approval");
      setReconciliationOpen(false); reconciliationForm.resetFields(); refetchCorrections();
    } catch (error: any) { message.error(error?.data?.message || "Could not submit attendance reconciliation"); }
  };

  if (!employee && !isLoading) {
    return (
      <div className="p-6 space-y-6">
        <GbHeader title="My Profile" />
        <Card className="rounded-xl"><Descriptions title="Profile Information" column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Name">{user?.name || "-"}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email || "-"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user?.phone || "-"}</Descriptions.Item>
          <Descriptions.Item label="Role">{user?.role || "ERP User"}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>{user?.address || "-"}</Descriptions.Item>
        </Descriptions></Card>
        <Alert type="info" showIcon message="Employee self-service is unavailable" description="This ERP login is not linked to an employee profile. Contact HR if you need employee access." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="My Profile" />
      <Card loading={isLoading} className="rounded-xl">
        <Descriptions title={employee?.fullName || "Employee Profile"} column={{ xs: 1, md: 3 }}>
          <Descriptions.Item label="Employee Code">{employee?.employeeCode}</Descriptions.Item>
          <Descriptions.Item label="Department">{employee?.department?.name || "-"}</Descriptions.Item>
          <Descriptions.Item label="Designation">{employee?.designation?.name || "-"}</Descriptions.Item>
          <Descriptions.Item label="Email">{employee?.email || "-"}</Descriptions.Item>
          <Descriptions.Item label="Phone">{employee?.phone || "-"}</Descriptions.Item>
          <Descriptions.Item label="Joining Date">{employee?.joiningDate || "-"}</Descriptions.Item>
          <Descriptions.Item label="Reporting Manager">{employee?.reportingManager?.fullName || "-"}</Descriptions.Item>
          <Descriptions.Item label="Employment Status"><Tag color="green">{employee?.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Present Address">{employee?.presentAddress || "-"}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="Attendance Records" value={attendance.length} prefix={<CalendarOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Approved Leave Days" value={balances.reduce((sum: number, balance: any) => sum + Number(balance.usedDays || 0), 0)} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="Remaining Leave Days" value={balances.reduce((sum: number, balance: any) => sum + Number(balance.remainingDays || 0), 0)} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>

      <Card title="Leave Balance" extra={<Button type="primary" icon={<UserOutlined />} onClick={() => setLeaveOpen(true)}>Apply for Leave</Button>}>
        {balances.length ? <Table dataSource={balances} rowKey="leaveTypeId" pagination={false} columns={[
          { title: "Leave Type", dataIndex: "leaveTypeName" }, { title: "Allowed", dataIndex: "totalAllowed" }, { title: "Used", dataIndex: "usedDays" },
          { title: "Remaining", dataIndex: "remainingDays", render: (value) => <Tag color={value > 0 ? "green" : "red"}>{value} days</Tag> },
        ]} /> : <Empty description="No leave balance configured" />}
      </Card>

      <Card
        title="My Attendance"
        extra={<Space><Button loading={clockingIn} onClick={() => openPunch("in")}>Check In</Button><Button loading={clockingOut} onClick={() => openPunch("out")}>Check Out</Button></Space>}
        className="overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-slate-50 p-3 sm:p-5">
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-sm text-slate-500">Your recent check-in and check-out history</p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">Last {attendance.length} records</span>
          </div>
          {attendance.length ? (
            <div className="space-y-3">
              {attendance.map((record: any) => {
                const visual = attendanceAppearance(record.status);
                const date = dayjs(record.attendanceDate);
                return (
                  <article key={record.id} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <span className={`absolute inset-y-5 left-0 w-1 rounded-r-full ${visual.stripe}`} />
                    <div className="grid grid-cols-1 gap-4 px-5 py-4 pl-6 sm:grid-cols-[1.35fr_1fr_1fr_auto_auto] sm:items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Date ({date.format("dddd")})</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">{date.format("DD MMM YYYY")}</span>
                          <span className={`grid h-7 min-w-7 place-items-center rounded-full px-1 text-xs font-bold ${visual.badge}`} title={record.status}>{visual.label}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600">In Time</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{formatAttendanceTime(record.clockInTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600">Out Time</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{formatAttendanceTime(record.clockOutTime)}</p>
                      </div>
                      <div className="sm:text-right">
                        <Tag color={record.status === "Present" ? "green" : record.status === "Late" ? "orange" : "blue"} className="!mr-0 !rounded-full !px-3 !py-1">{record.status || "Pending"}</Tag>
                        {record.workHours != null && <p className="mt-2 text-xs text-slate-500">{record.workHours} hrs worked</p>}
                      </div>
                      <div className="sm:text-right"><Button size="small" icon={<EditOutlined />} onClick={() => openReconciliation(record)}>Edit / Reconcile</Button></div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <Empty description="No attendance records yet" />}
        </div>
      </Card>

      <Modal open={!!punchMode} title={punchMode === "in" ? "Check In" : "Check Out"} footer={null} onCancel={() => { setPunchMode(null); setPunchLocation(null); }} destroyOnClose>
        {punchLocation ? <Form form={punchForm} layout="vertical" onFinish={punch}>
          <div className="attendance-location-map h-52 overflow-hidden rounded-xl border mb-5 bg-slate-100">
            <AttendanceLocationMap office={assignedOffice} employeeLocation={punchLocation} isInsideRange={insideOfficeRange} />
            {assignedOffice && <div className="absolute rounded-full border-2 border-blue-600 bg-blue-500/20 pointer-events-none flex items-center justify-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: Math.min(180, Math.max(64, Math.sqrt(Number(assignedOffice.radiusMeters || 100)) * 8)), height: Math.min(180, Math.max(64, Math.sqrt(Number(assignedOffice.radiusMeters || 100)) * 8)) }}><span className="absolute w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" /><span className="absolute bg-white/90 rounded-full px-2 py-1 text-xs font-bold text-blue-700 whitespace-nowrap" style={{ top: "calc(100% + 4px)" }}>{assignedOffice.name} · {assignedOffice.radiusMeters}m</span></div>}
            {punchLocation && <div className={`absolute w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none ${insideOfficeRange ? "bg-emerald-500" : "bg-red-500"}`} style={{ left: `${Math.max(2, Math.min(98, currentLeft))}%`, top: `${Math.max(2, Math.min(98, currentTop))}%`, transform: "translate(-50%, -50%)" }} title="Your current location" />}
          </div>
          {hasAssignedOfficeLocation ? <Alert className="mb-4" type={insideOfficeRange ? "success" : "error"} showIcon message={insideOfficeRange ? "You are inside the office attendance range" : "You are outside the office attendance range"} description={`${assignedOffice.name} allows check-in/out within ${assignedOffice.radiusMeters || 100}m. You are ${Math.round(locationDistance)}m from the office.`} /> : <Alert className="mb-4" type="warning" showIcon message="No office geofence is assigned" description="Your location is shown, but HR needs to assign an office location to validate attendance range." />}
          <p className="text-xs text-gray-500 mb-4">Current location: {punchLocation.latitude.toFixed(6)}, {punchLocation.longitude.toFixed(6)}</p>
          <Form.Item name="remarks" label="Remarks"><TextArea rows={3} placeholder="Optional note for this attendance" /></Form.Item>
          <Space className="w-full justify-end"><Button onClick={() => setPunchMode(null)}>Cancel</Button><Button htmlType="submit" type="primary" loading={clockingIn || clockingOut}>Submit</Button></Space>
        </Form> : <div className="py-10 text-center">Getting your location…</div>}
      </Modal>

      <Card title="My Attendance Reconciliation Requests">
        <Table dataSource={corrections} rowKey="id" pagination={{ pageSize: 6, hideOnSinglePage: true }} scroll={{ x: true }} locale={{ emptyText: "No reconciliation request yet" }} columns={[
          { title: "Date", dataIndex: "attendanceDate" },
          { title: "Requested In", dataIndex: "requestedClockIn", render: formatAttendanceTime },
          { title: "Requested Out", dataIndex: "requestedClockOut", render: formatAttendanceTime },
          { title: "Reason", dataIndex: "reason", ellipsis: true },
          { title: "Approval Stage", render: (_: any, row: any) => row.status === "Pending" ? <Tag color="gold">{row.approvalStage === "PendingDeptHead" ? "Department Head review" : "Final approval"}</Tag> : <Tag color={row.status === "Approved" ? "green" : "red"}>{row.status}</Tag> },
        ]} />
      </Card>

      <Card title="My Leave Applications">
        <Table className="leave-applications-table" dataSource={leaves} rowKey="id" pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }} scroll={{ x: true }} columns={[
          { title: "Leave Type", render: (_: any, row: any) => row.leaveType?.name || "-" }, { title: "From", dataIndex: "startDate" }, { title: "To", dataIndex: "endDate" }, { title: "Days", dataIndex: "daysCount" },
          { title: "Status", dataIndex: "status", render: (v) => <Tag color={v === "Approved" ? "green" : v === "Rejected" ? "red" : "orange"}>{v}</Tag> }, { title: "Reason", dataIndex: "reason" },
          { title: "Approval Status", render: (_: any, row: any) => row.status === "Pending" ? <span>{row.approvalInfo?.currentWith?.name || "Approver"}</span> : <span className="text-xs">{row.approvalInfo?.departmentHeadApprovedBy?.name && <>Dept Head: {row.approvalInfo.departmentHeadApprovedBy.name}<br /></>}{row.approvalInfo?.finalApprovedBy?.name && <>Final: {row.approvalInfo.finalApprovedBy.name}</>}</span> },
          { title: "", render: (_: any, row: any) => <Button size="small" type="link" onClick={() => setSelectedLeave(row)}>View details</Button> },
        ]} />
      </Card>

      <Modal open={!!selectedLeave} onCancel={() => setSelectedLeave(null)} footer={null} width={620} destroyOnClose className="leave-detail-modal">
        {selectedLeave && <div className="pt-3 text-[#071b59]">
          <div className="flex items-center justify-between pr-8 mb-5">
            <div><Tag color={selectedLeave.status === "Approved" ? "green" : selectedLeave.status === "Rejected" ? "red" : "gold"}>{selectedLeave.status}</Tag><h2 className="text-xl font-bold mt-2">{selectedLeave.leaveType?.name || "Leave Application"}</h2></div>
          </div>
          <Row gutter={[12, 12]} className="mb-5">
            <Col span={8}><div className="rounded-xl bg-[#f1f4ff] p-3"><p className="text-xs text-[#5470ba] mb-1">From</p><b>{dayjs(selectedLeave.startDate).format("ddd, D MMM")}</b></div></Col>
            <Col span={8}><div className="rounded-xl bg-[#f1f4ff] p-3"><p className="text-xs text-[#5470ba] mb-1">To</p><b>{dayjs(selectedLeave.endDate).format("ddd, D MMM")}</b></div></Col>
            <Col span={8}><div className="rounded-xl bg-[#f1f4ff] p-3"><p className="text-xs text-[#5470ba] mb-1">Leave Taken</p><b>{selectedLeave.daysCount} Days</b></div></Col>
          </Row>
          <p className="text-xs font-semibold text-[#5470ba] uppercase">Remarks</p><p className="text-base mb-6">{selectedLeave.reason || "-"}</p>
          <p className="text-xs font-semibold text-[#5470ba] uppercase mb-3">Approver History</p>
          <ApprovalStep label="Department Head" approver={selectedLeave.approvalInfo?.departmentHeadApprovedBy || (selectedLeave.approvalStage === "PendingDeptHead" ? selectedLeave.approvalInfo?.currentWith : null)} state={selectedLeave.approvalInfo?.departmentHeadApprovedBy ? "Approved" : selectedLeave.approvalStage === "PendingDeptHead" ? "Under Processing" : "Waiting"} />
          <ApprovalStep label="Final Approver" approver={selectedLeave.approvalInfo?.finalApprovedBy || (selectedLeave.approvalStage === "PendingFinalApproval" ? selectedLeave.approvalInfo?.currentWith : null)} state={selectedLeave.approvalInfo?.finalApprovedBy ? "Approved" : selectedLeave.approvalStage === "PendingFinalApproval" ? "Under Processing" : "Waiting"} last />
        </div>}
      </Modal>

      <Modal title="Apply for Leave" open={leaveOpen} onCancel={() => setLeaveOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={submitLeave}>
          <Form.Item name="leaveTypeId" label="Leave Type" rules={[{ required: true, message: "Select a leave type" }]}><Select options={leaveTypes.map((item: any) => ({ value: item.id, label: item.name }))} /></Form.Item>
          <Form.Item name="dates" label="Date Range" rules={[{ required: true, message: "Select leave dates" }]}><RangePicker className="w-full" disabledDate={(date) => date && date < dayjs().startOf("day")} /></Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Enter a reason" }]}><TextArea rows={3} /></Form.Item>
          <Form.Item name="emergencyPhone" label="Emergency Phone"><Input /></Form.Item>
          <Space className="w-full justify-end"><Button onClick={() => setLeaveOpen(false)}>Cancel</Button><Button htmlType="submit" type="primary" loading={isApplying}>Submit Application</Button></Space>
        </Form>
      </Modal>

      <Modal title="Attendance Reconciliation Request" open={reconciliationOpen} onCancel={() => { setReconciliationOpen(false); reconciliationForm.resetFields(); }} footer={null} destroyOnClose>
        <Alert className="mb-5" type="info" showIcon message="Two-step approval required" description="Your Department Head reviews first. Attendance time changes only after the Final Approver approves." />
        <Form form={reconciliationForm} layout="vertical" onFinish={submitAttendanceReconciliation}>
          <Form.Item name="attendanceDate" label="Attendance Date" rules={[{ required: true, message: "Select attendance date" }]}><DatePicker className="w-full" disabled /></Form.Item>
          <Row gutter={12}><Col span={12}><Form.Item name="requestedClockIn" label="Corrected Check-in"><DatePicker.TimePicker className="w-full" format="hh:mm A" use12Hours /></Form.Item></Col><Col span={12}><Form.Item name="requestedClockOut" label="Corrected Check-out"><DatePicker.TimePicker className="w-full" format="hh:mm A" use12Hours /></Form.Item></Col></Row>
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Explain why this correction is required" }]}><TextArea rows={4} placeholder="Example: biometric device was offline during check-in" /></Form.Item>
          <Space className="w-full justify-end"><Button onClick={() => setReconciliationOpen(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSubmittingReconciliation}>Send for Approval</Button></Space>
        </Form>
      </Modal>
    </div>
  );
}

function ApprovalStep({ label, approver, state, last = false }: any) {
  const color = state === "Approved" ? "green" : state === "Under Processing" ? "gold" : "default";
  return <div className="flex gap-3"><div className="flex flex-col items-center"><span className={`w-3 h-3 rounded-full ${state === "Approved" ? "bg-emerald-500" : state === "Under Processing" ? "bg-amber-400" : "bg-gray-300"}`} />{!last && <span className="w-px min-h-12 bg-gray-300" />}</div><div className="pb-4 flex-1"><div className="flex justify-between gap-2"><div><p className="font-semibold">{approver?.name || label}</p><p className="text-sm text-gray-500">{approver?.title || label}</p></div><Tag color={color}>{state}</Tag></div></div></div>;
}
