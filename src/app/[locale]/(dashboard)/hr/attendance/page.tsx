"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
  Tabs,
  DatePicker,
  TimePicker,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  CalendarOutlined,
  ApiOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetAttendanceQuery,
  useGetAttendanceSummaryQuery,
  useClockInMutation,
  useClockOutMutation,
  useManualAttendanceEntryMutation,
  useGetBiometricPunchLogsQuery,
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { TabPane } = Tabs;

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [selectedDept, setSelectedDept] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("roster");

  // Modals
  const [clockInModal, setClockInModal] = useState(false);
  const [manualAdjModal, setManualAdjModal] = useState(false);
  const [adjustingRecord, setAdjustingRecord] = useState<any>(null);

  // Forms
  const [clockInForm] = Form.useForm();
  const [manualForm] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetAttendanceQuery({
    date: selectedDate || undefined,
    departmentId: selectedDept || undefined,
  });
  const { data: summaryData, refetch: refetchSummary } = useGetAttendanceSummaryQuery({
    date: selectedDate,
  });
  const { data: punchLogsData, isLoading: punchLogsLoading, refetch: refetchLogs } = useGetBiometricPunchLogsQuery({
    limit: 50,
  });
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data: deptData } = useGetDepartmentsQuery(undefined);

  // Mutations
  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut] = useClockOutMutation();
  const [manualEntry, { isLoading: isSavingAdj }] = useManualAttendanceEntryMutation();

  const records = data?.data || [];
  const summary = summaryData?.data;
  const punchLogs = punchLogsData?.data?.logs || [];
  const employees = employeesData?.data || [];
  const departments = deptData?.data || [];

  const handleClockIn = async (values: any) => {
    try {
      await clockIn(values).unwrap();
      message.success("Employee attendance clock-in recorded");
      setClockInModal(false);
      clockInForm.resetFields();
      refetch();
      refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to clock in");
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      await clockOut({ employeeId }).unwrap();
      message.success("Employee clock-out recorded");
      refetch();
      refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to clock out");
    }
  };

  const handleOpenAdjustment = (record?: any) => {
    setAdjustingRecord(record || null);
    if (record) {
      manualForm.setFieldsValue({
        employeeId: record.employeeId,
        attendanceDate: record.attendanceDate,
        clockInTime: record.clockInTime ? dayjs(`2000-01-01 ${record.clockInTime}`) : undefined,
        clockOutTime: record.clockOutTime ? dayjs(`2000-01-01 ${record.clockOutTime}`) : undefined,
        status: record.status,
        lateMinutes: record.lateMinutes || 0,
        remarks: record.remarks,
      });
    } else {
      manualForm.resetFields();
      manualForm.setFieldsValue({
        attendanceDate: selectedDate,
        status: "Present",
      });
    }
    setManualAdjModal(true);
  };

  const handleSaveAdjustment = async (values: any) => {
    try {
      const payload = {
        employeeId: values.employeeId,
        attendanceDate: values.attendanceDate,
        clockInTime: values.clockInTime ? dayjs(values.clockInTime).format("HH:mm:ss") : undefined,
        clockOutTime: values.clockOutTime ? dayjs(values.clockOutTime).format("HH:mm:ss") : undefined,
        status: values.status,
        lateMinutes: values.lateMinutes || 0,
        remarks: values.remarks,
      };
      await manualEntry(payload).unwrap();
      message.success("Attendance adjusted successfully");
      setManualAdjModal(false);
      manualForm.resetFields();
      refetch();
      refetchSummary();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to adjust attendance");
    }
  };

  const rosterColumns: any = [
    {
      title: "Date",
      dataIndex: "attendanceDate",
      key: "attendanceDate",
      render: (d: string) => <span className="font-mono text-xs text-gray-700">{d}</span>,
    },
    {
      title: "Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900 block text-sm">{name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{record.employee?.employeeCode}</span>
            {record.employee?.biometricUserId && (
              <Tag color="cyan" className="text-[10px] font-mono px-1 py-0 m-0">
                Bio ID: {record.employee?.biometricUserId}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Department",
      dataIndex: ["employee", "department", "name"],
      key: "department",
      render: (d: string) => <Tag color="blue">{d || "General"}</Tag>,
    },
    {
      title: "Clock In",
      dataIndex: "clockInTime",
      key: "clockInTime",
      render: (t: string) => (
        <span className="font-mono text-emerald-700 font-semibold">{t || "-"}</span>
      ),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOutTime",
      key: "clockOutTime",
      render: (t: string) => (
        <span className="font-mono text-blue-700 font-semibold">{t || "-"}</span>
      ),
    },
    {
      title: "Work Hours",
      dataIndex: "workHours",
      key: "workHours",
      align: "center" as const,
      render: (hrs: number) => (
        <span className="font-bold text-gray-800 font-mono">
          {hrs ? `${hrs} hrs` : "-"}
        </span>
      ),
    },
    {
      title: "Late Arrival",
      dataIndex: "lateMinutes",
      key: "lateMinutes",
      align: "center" as const,
      render: (mins: number) => (
        <span className={mins > 0 ? "text-rose-600 font-bold" : "text-gray-400 text-xs"}>
          {mins > 0 ? `${mins} mins` : "On Time"}
        </span>
      ),
    },
    {
      title: "Source",
      dataIndex: "punchSource",
      key: "punchSource",
      align: "center" as const,
      render: (src: string, r: any) => (
        <Tag color={src === "BiometricDevice" ? "cyan" : "default"} className="text-[11px]">
          {src === "BiometricDevice" ? (
            <span className="flex items-center gap-1">
              <ApiOutlined /> Hardware
            </span>
          ) : (
            "Web Manual"
          )}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Present" ? "green" : st === "Late" ? "orange" : st === "OnLeave" ? "blue" : "volcano"}>
          {st}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {!record.clockOutTime && (
            <Button
              size="small"
              type="primary"
              className="bg-blue-600 hover:bg-blue-700 text-xs"
              onClick={() => handleClockOut(record.employeeId)}
            >
              Clock Out
            </Button>
          )}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenAdjustment(record)}
            className="text-gray-600"
          />
        </Space>
      ),
    },
  ];

  const punchLogColumns: any = [
    {
      title: "Punch Timestamp",
      dataIndex: "punchTime",
      key: "punchTime",
      render: (dt: string) => (
        <span className="font-mono text-xs font-semibold text-gray-800">
          {dayjs(dt).format("YYYY-MM-DD HH:mm:ss")}
        </span>
      ),
    },
    {
      title: "Machine Device",
      dataIndex: ["device", "name"],
      key: "device",
      render: (d: string) => (
        <Tag color="cyan" className="font-medium">
          <ApiOutlined className="mr-1" /> {d || "Cloud Push API"}
        </Tag>
      ),
    },
    {
      title: "Biometric User ID",
      dataIndex: "biometricUserId",
      key: "biometricUserId",
      render: (id: string) => <span className="font-mono font-bold text-gray-900">{id}</span>,
    },
    {
      title: "Matched Employee",
      key: "matchedEmployee",
      render: (_: any, record: any) =>
        record.matchedEmployee ? (
          <div>
            <span className="font-bold text-emerald-800 block text-xs">
              {record.matchedEmployee.fullName}
            </span>
            <span className="text-[11px] text-gray-400">
              {record.matchedEmployee.department?.name || "Staff"} ({record.matchedEmployee.employeeCode})
            </span>
          </div>
        ) : (
          <Tag color="orange">Unassigned Machine ID</Tag>
        ),
    },
    {
      title: "Verification Mode",
      dataIndex: "verifyType",
      key: "verifyType",
      align: "center" as const,
      render: (v: string) => <Tag color="blue">{v || "Fingerprint"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isProcessed",
      key: "isProcessed",
      align: "center" as const,
      render: (p: boolean) => (
        <Tag color={p ? "green" : "volcano"}>{p ? "Synced" : "Pending"}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Daily Attendance & Live Biometric Stream" />

      {/* KPI Dashboard Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Present Today</span>}
              value={summary?.presentCount || 0}
              suffix={`/ ${summary?.totalEmployees || 0}`}
              prefix={<CheckCircleOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Late Arrivals</span>}
              value={summary?.lateCount || 0}
              prefix={<ExclamationCircleOutlined className="text-amber-500" />}
              valueStyle={{ fontWeight: "bold", color: "#d97706" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">On Leave</span>}
              value={summary?.onLeaveCount || 0}
              prefix={<CalendarOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#2563eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Absent Today</span>}
              value={summary?.absentCount || 0}
              prefix={<StopOutlined className="text-rose-500" />}
              valueStyle={{ fontWeight: "bold", color: "#e11d48" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabbed Card */}
      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          {/* TAB 1: ATTENDANCE ROSTER */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <ClockCircleOutlined className="text-emerald-600" />
                Daily Attendance Roster
              </span>
            }
            key="roster"
          >
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-44 font-medium"
                  />
                  <Select
                    placeholder="All Departments"
                    value={selectedDept}
                    onChange={setSelectedDept}
                    allowClear
                    style={{ width: 180 }}
                  >
                    {departments.map((d: any) => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => { refetch(); refetchSummary(); }}>
                    Refresh
                  </Button>
                  <Button
                    onClick={() => handleOpenAdjustment()}
                    className="border-emerald-600 text-emerald-700"
                  >
                    Manual Adjustment
                  </Button>
                  <Button
                    type="primary"
                    icon={<ClockCircleOutlined />}
                    onClick={() => setClockInModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 border-none"
                  >
                    Record Clock-In
                  </Button>
                </Space>
              </div>

              <Table
                dataSource={records}
                rowKey="id"
                columns={rosterColumns}
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>

          {/* TAB 2: LIVE BIOMETRIC PUNCH STREAM */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <ApiOutlined className="text-cyan-600" />
                Live Biometric Device Punches ({punchLogs.length})
              </span>
            }
            key="biometric_stream"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center bg-cyan-50/60 p-3 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 text-xs text-cyan-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Real-time hardware punch stream received from fingerprint & facial devices via API.</span>
                </div>
                <Button size="small" icon={<ReloadOutlined />} onClick={() => refetchLogs()}>
                  Refresh Stream
                </Button>
              </div>

              <Table
                dataSource={punchLogs}
                rowKey="id"
                columns={punchLogColumns}
                loading={punchLogsLoading}
                pagination={{ pageSize: 10 }}
                className="custom_scroll"
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* MODAL 1: RECORD CLOCK IN */}
      <Modal
        title="Record Employee Clock-In"
        open={clockInModal}
        onCancel={() => setClockInModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={clockInForm} layout="vertical" onFinish={handleClockIn}>
          <Form.Item
            name="employeeId"
            label="Select Employee"
            rules={[{ required: true, message: "Please select an employee" }]}
          >
            <Select
              placeholder="Search employee..."
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setClockInModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isClockingIn}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Clock In Now
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: MANUAL ATTENDANCE ADJUSTMENT / REGULARIZATION */}
      <Modal
        title={adjustingRecord ? "Adjust Employee Attendance" : "Manual Attendance Regularization"}
        open={manualAdjModal}
        onCancel={() => setManualAdjModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={manualForm} layout="vertical" onFinish={handleSaveAdjustment}>
          <Form.Item
            name="employeeId"
            label="Employee"
            rules={[{ required: true, message: "Please select employee" }]}
          >
            <Select
              placeholder="Select employee"
              disabled={Boolean(adjustingRecord)}
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="attendanceDate"
            label="Attendance Date"
            rules={[{ required: true }]}
          >
            <Input type="date" className="w-full" disabled={Boolean(adjustingRecord)} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="clockInTime" label="Clock In Time">
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>

            <Form.Item name="clockOutTime" label="Clock Out Time">
              <TimePicker format="HH:mm:ss" className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label="Status" initialValue="Present">
              <Select>
                <Option value="Present">Present</Option>
                <Option value="Late">Late</Option>
                <Option value="HalfDay">Half Day</Option>
                <Option value="Absent">Absent</Option>
                <Option value="OnLeave">On Leave</Option>
              </Select>
            </Form.Item>

            <Form.Item name="lateMinutes" label="Late (Minutes)" initialValue={0}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Supervisor Remarks / Reason">
            <Input.TextArea rows={2} placeholder="Reason for manual adjustment..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setManualAdjModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSavingAdj}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Save Attendance
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
