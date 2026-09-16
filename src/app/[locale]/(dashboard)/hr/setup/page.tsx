"use client";
import React, { useState } from "react";
import {
  Tabs,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
  Alert,
  Divider,
  Tooltip,
  Drawer,
  Badge,
  Empty,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  KeyOutlined,
  CopyOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  SyncOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { formatBD } from "@/helpers/bdTime";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useDeleteDesignationMutation,
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useGetShiftsQuery,
  useCreateShiftMutation,
  useGetBiometricDevicesQuery,
  useRegisterBiometricDeviceMutation,
  useRegenerateDeviceKeyMutation,
  useDeleteBiometricDeviceMutation,
  useSyncBiometricPunchMutation,
  useSyncDeviceNowMutation,
  useGetBiometricDeviceUsersQuery,
  useGetEnrolledDeviceUsersQuery,
  useGetEmployeesQuery,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
} from "@/redux/api/hrPayrollApi";

const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Paragraph } = Typography;

export default function HrSetupPage() {
  const [activeTab, setActiveTab] = useState("biometric");

  // Modals
  const [deptModal, setDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [desigModal, setDesigModal] = useState(false);
  const [leaveTypeModal, setLeaveTypeModal] = useState(false);
  const [shiftModal, setShiftModal] = useState(false);
  const [deviceModal, setDeviceModal] = useState(false);
  const [simModal, setSimModal] = useState(false);
  const [usersDrawerDevice, setUsersDrawerDevice] = useState<any>(null);
  const [deptHeadModal, setDeptHeadModal] = useState<any>(null);
  const [usersDrawerTab, setUsersDrawerTab] = useState<string>("punched");

  // Forms
  const [deptForm] = Form.useForm();
  const [deptHeadForm] = Form.useForm();
  const [desigForm] = Form.useForm();
  const [leaveTypeForm] = Form.useForm();
  const [shiftForm] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [simForm] = Form.useForm();
  const [holidayForm] = Form.useForm();
  const [holidayModal, setHolidayModal] = useState(false);

  // Queries
  const { data: deptData, isLoading: deptLoading, refetch: refetchDept } = useGetDepartmentsQuery(undefined);
  const { data: desigData, isLoading: desigLoading, refetch: refetchDesig } = useGetDesignationsQuery(undefined);
  const { data: leaveTypeData, isLoading: leaveTypeLoading, refetch: refetchLeaveType } = useGetLeaveTypesQuery(undefined);
  const { data: shiftData, isLoading: shiftLoading, refetch: refetchShift } = useGetShiftsQuery(undefined);
  const { data: deviceData, isLoading: deviceLoading, refetch: refetchDevice } = useGetBiometricDevicesQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data: holidayData, isLoading: holidayLoading, refetch: refetchHolidays } = useGetHolidaysQuery(undefined);

  // Mutations
  const [createDept] = useCreateDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();
  const [createDesig] = useCreateDesignationMutation();
  const [deleteDesig] = useDeleteDesignationMutation();
  const [createLeaveType] = useCreateLeaveTypeMutation();
  const [createShift] = useCreateShiftMutation();
  const [createHoliday] = useCreateHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();
  const [registerDevice] = useRegisterBiometricDeviceMutation();
  const [regenerateKey] = useRegenerateDeviceKeyMutation();
  const [deleteDevice] = useDeleteBiometricDeviceMutation();
  const [syncPunch, { isLoading: isSyncing }] = useSyncBiometricPunchMutation();
  const [syncDeviceNow] = useSyncDeviceNowMutation();
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const holidays = holidayData?.data || [];
  const saveHoliday = async (values: any) => { try { await createHoliday(values).unwrap(); message.success("Holiday added"); holidayForm.resetFields(); setHolidayModal(false); refetchHolidays(); } catch (err: any) { message.error(err?.data?.message || "Could not add holiday"); } };
  const { data: deviceUsersData, isLoading: deviceUsersLoading } = useGetBiometricDeviceUsersQuery(
    usersDrawerDevice ? { id: usersDrawerDevice.id } : ({} as any),
    { skip: !usersDrawerDevice }
  );
  const { data: enrolledUsersData, isLoading: enrolledUsersLoading } = useGetEnrolledDeviceUsersQuery(
    usersDrawerDevice?.id,
    { skip: !usersDrawerDevice || usersDrawerTab !== "enrolled" }
  );

  const departments = deptData?.data || [];
  const designations = desigData?.data || [];
  const leaveTypes = leaveTypeData?.data || [];
  const shifts = shiftData?.data || [];
  const devices = deviceData?.data || [];
  const employees = employeesData?.data || [];

  // Handlers
  const handleCreateDept = async (values: any) => {
    try {
      if (editingDept) {
        await updateDept({ id: editingDept.id, ...values }).unwrap();
        message.success("Department updated successfully");
      } else {
        await createDept(values).unwrap();
        message.success("Department created successfully");
      }
      setDeptModal(false);
      setEditingDept(null);
      deptForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create department");
    }
  };

  const handleSetDeptHead = async (values: any) => {
    try {
      await updateDept({ id: deptHeadModal.id, headEmployeeId: values.headEmployeeId || null }).unwrap();
      message.success("Department Head updated successfully");
      setDeptHeadModal(null);
      deptHeadForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update Department Head");
    }
  };

  const handleCreateDesig = async (values: any) => {
    try {
      await createDesig(values).unwrap();
      message.success("Designation created successfully");
      setDesigModal(false);
      desigForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create designation");
    }
  };

  const handleCreateLeaveType = async (values: any) => {
    try {
      await createLeaveType(values).unwrap();
      message.success("Leave policy created successfully");
      setLeaveTypeModal(false);
      leaveTypeForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create leave policy");
    }
  };

  const handleCreateShift = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        startTime: values.startTime ? dayjs(values.startTime).format("HH:mm:ss") : "09:00:00",
        endTime: values.endTime ? dayjs(values.endTime).format("HH:mm:ss") : "18:00:00",
        graceMinutes: values.graceMinutes || 15,
        fullDayHours: values.fullDayHours || 8,
        halfDayHours: values.halfDayHours || 4,
        isDefault: values.isDefault || false,
      };
      await createShift(payload).unwrap();
      message.success("Work shift created successfully");
      setShiftModal(false);
      shiftForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create work shift");
    }
  };

  const handleRegisterDevice = async (values: any) => {
    try {
      const res = await registerDevice(values).unwrap();
      message.success("Biometric device registered successfully");
      setDeviceModal(false);
      deviceForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to register device");
    }
  };

  const handleRegenerateKey = async (id: string) => {
    try {
      await regenerateKey(id).unwrap();
      message.success("Device API Key regenerated successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to regenerate key");
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await deleteDevice(id).unwrap();
      message.success("Device removed successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to remove device");
    }
  };

  const handleSyncNow = async (id: string) => {
    setSyncingDeviceId(id);
    try {
      const res = await syncDeviceNow(id).unwrap();
      if (res.success) {
        message.success(res.message || "Device connected successfully");
      } else {
        message.error(res.message || "Failed to connect to device");
      }
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to connect to device");
    } finally {
      setSyncingDeviceId(null);
    }
  };

  const handleSimulatePunch = async (values: any) => {
    try {
      const payload = {
        apiKey: values.apiKey,
        logs: [
          {
            biometricUserId: values.biometricUserId,
            timestamp: new Date().toISOString(),
            punchType: values.punchType || "CheckIn",
            verifyType: values.verifyType || "Fingerprint",
          },
        ],
      };
      const res = await syncPunch(payload).unwrap();
      message.success(res?.message || "Test punch synced successfully!");
      setSimModal(false);
      simForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to simulate punch");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Master Setup & Biometric Integration" />

      <Card className="shadow-sm rounded-xl border border-gray-200">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large" type="card">
          {/* TAB 1: BIOMETRIC DEVICES & API */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <ApiOutlined className="text-emerald-600" />
                Biometric Devices & API Keys
              </span>
            }
            key="biometric"
          >
            <div className="space-y-6 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h3 className="text-base font-bold text-emerald-900">
                    Fingerprint & Biometric Hardware Integration Hub
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Connect ZKTeco, Hikvision, Realtime, Anviz or any biometric device using secure Webhooks / HTTP Push API.
                  </p>
                </div>
                <Space>
                  <Button
                    icon={<PlayCircleOutlined />}
                    onClick={() => setSimModal(true)}
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-100"
                  >
                    Test Punch Simulator
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setDeviceModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 border-none"
                  >
                    Register New Device
                  </Button>
                </Space>
              </div>

              {/* Registered Devices Table */}
              <Table
                dataSource={devices}
                rowKey="id"
                loading={deviceLoading}
                pagination={{ pageSize: 5 }}
                className="custom_scroll"
                columns={[
                  {
                    title: "Device Name",
                    dataIndex: "name",
                    key: "name",
                    render: (name: string, record: any) => (
                      <div>
                        <span className="font-semibold text-gray-900 block">{name}</span>
                        <span className="text-xs text-gray-400 font-mono">
                          {record.deviceModel || "Universal"} | SN: {record.deviceSerial || "N/A"}
                        </span>
                      </div>
                    ),
                  },
                  {
                    title: "Location / Branch",
                    dataIndex: "location",
                    key: "location",
                    render: (loc: string) => <Tag color="blue">{loc || "Head Office"}</Tag>,
                  },
                  {
                    title: "IP / Port",
                    key: "ip",
                    render: (_: any, r: any) => (
                      <span className="font-mono text-xs text-gray-600">
                        {r.ipAddress ? `${r.ipAddress}:${r.port || 4370}` : "Cloud Push Mode"}
                      </span>
                    ),
                  },
                  {
                    title: "Device API Key",
                    dataIndex: "apiKey",
                    key: "apiKey",
                    render: (key: string, record: any) => (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 px-2.5 py-1 rounded border border-gray-300 max-w-[200px] truncate">
                          {key}
                        </span>
                        <Tooltip title="Copy API Key">
                          <Button
                            type="text"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(key)}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Regenerate API Key?"
                          description="Existing device webhook will need to be updated with the new key."
                          onConfirm={() => handleRegenerateKey(record.id)}
                        >
                          <Tooltip title="Regenerate Key">
                            <Button type="text" size="small" icon={<KeyOutlined className="text-amber-600" />} />
                          </Tooltip>
                        </Popconfirm>
                      </div>
                    ),
                  },
                  {
                    title: "Total Punches",
                    dataIndex: "totalPunchesRecorded",
                    key: "totalPunchesRecorded",
                    align: "center",
                    render: (cnt: number) => <span className="font-bold text-emerald-700">{cnt || 0}</span>,
                  },
                  {
                    title: "Connection",
                    key: "connection",
                    align: "center",
                    render: (_: any, record: any) => (
                      <Tooltip
                        title={
                          record.isOnline
                            ? `Last connected: ${formatBD(record.lastSyncAt)} (BD time)`
                            : record.lastConnectionError || (record.lastSyncAt ? "Not connected recently" : "Never connected yet")
                        }
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <Badge
                            status={record.isOnline ? "success" : "error"}
                            text={
                              <span className={`text-xs font-semibold ${record.isOnline ? "text-emerald-700" : "text-rose-600"}`}>
                                {record.isOnline ? "Online" : "Offline"}
                              </span>
                            }
                          />
                          <span className="text-[10px] text-gray-400">
                            {record.lastSyncAt ? formatBD(record.lastSyncAt, "HH:mm:ss") : "Never synced"}
                          </span>
                        </div>
                      </Tooltip>
                    ),
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    align: "center",
                    render: (st: string) => (
                      <Tag color={st === "Active" ? "green" : "volcano"}>{st}</Tag>
                    ),
                  },
                  {
                    title: "Action",
                    key: "action",
                    align: "center",
                    render: (_: any, record: any) => (
                      <Space direction="vertical" size={4}>
                        <Space size={4}>
                          <Tooltip title="Connect now & pull latest punches">
                            <Button
                              size="small"
                              icon={<SyncOutlined spin={syncingDeviceId === record.id} />}
                              loading={syncingDeviceId === record.id}
                              onClick={() => handleSyncNow(record.id)}
                              className="text-blue-600 border-blue-300"
                            >
                              Sync Now
                            </Button>
                          </Tooltip>
                          <Tooltip title="See who punched on this device today">
                            <Button
                              size="small"
                              icon={<TeamOutlined />}
                              onClick={() => {
                                setUsersDrawerTab("punched");
                                setUsersDrawerDevice(record);
                              }}
                              className="text-purple-600 border-purple-300"
                            >
                              Users
                            </Button>
                          </Tooltip>
                        </Space>
                        <Popconfirm
                          title="Delete this device?"
                          onConfirm={() => handleDeleteDevice(record.id)}
                        >
                          <Button size="small" danger block>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />

              {/* Developer & Integration API Guide */}
              <Card
                title={
                  <span className="text-sm font-bold flex items-center gap-2 text-gray-800">
                    <KeyOutlined className="text-emerald-600" />
                    Biometric Machine Push Webhook API Specification
                  </span>
                }
                className="bg-gray-50 border-gray-200"
              >
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 font-bold bg-emerald-600 text-white rounded text-[11px]">
                      POST
                    </span>
                    <span className="font-mono text-gray-800 font-semibold text-sm">
                      /api/v1/hr-payroll/biometric/sync
                    </span>
                  </div>

                  <p className="text-gray-600">
                    Configure your Biometric Machine, Cloud Server, or Node.js/Python local sync middleware to HTTP POST punch logs to this endpoint whenever an employee touches the fingerprint sensor or scans face.
                  </p>

                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">
                      Sample JSON Payload (Single / Batch Punches):
                    </span>
                    <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono text-[11px] overflow-x-auto">
{`{
  "apiKey": "cbmnp_bio_xxxxxxxxxxxxxxxxxxxxxxxx",
  "logs": [
    {
      "biometricUserId": "1001",
      "timestamp": "2026-09-09T09:15:30Z",
      "punchType": "CheckIn",
      "verifyType": "Fingerprint"
    }
  ]
}`}
                    </pre>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700 block mb-1">
                      cURL Command Sample:
                    </span>
                    <pre className="bg-gray-900 text-gray-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`curl -X POST http://localhost:5000/api/v1/hr-payroll/biometric/sync \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey": "YOUR_DEVICE_API_KEY", "logs": [{"biometricUserId": "1001", "timestamp": "2026-09-09 09:15:00", "punchType": "CheckIn", "verifyType": "Fingerprint"}]}'`}
                    </pre>
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>

          {/* TAB 2: DEPARTMENTS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <ApartmentOutlined className="text-blue-600" />
                Departments ({departments.length})
              </span>
            }
            key="departments"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Company Departments</span>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => { setEditingDept(null); deptForm.resetFields(); setDeptModal(true); }}
                  className="bg-blue-600 hover:bg-blue-700 border-none"
                >
                  Add Department
                </Button>
              </div>

              <Table
                dataSource={departments}
                rowKey="id"
                loading={deptLoading}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Department Name",
                    dataIndex: "name",
                    key: "name",
                    render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
                  },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    render: (desc: string) => <span className="text-gray-500 text-xs">{desc || "N/A"}</span>,
                  },
                  {
                    title: "Department Head (1st Approver)",
                    key: "headEmployee",
                    render: (_: any, record: any) =>
                      record.headEmployee ? (
                        <Tag color="geekblue">{record.headEmployee.fullName}</Tag>
                      ) : (
                        <Tag color="default">Not set</Tag>
                      ),
                  },
                  {
                    title: "Action",
                    key: "action",
                    align: "center",
                    render: (_: any, record: any) => (
                      <Space size="small">
                        <Button size="small" onClick={() => { setEditingDept(record); deptForm.setFieldsValue({ name: record.name, description: record.description, weeklyOffDays: record.weeklyOffDays?.length ? record.weeklyOffDays : [5] }); setDeptModal(true); }}>Edit</Button>
                        <Button
                          size="small"
                          onClick={() => {
                            deptHeadForm.setFieldsValue({ headEmployeeId: record.headEmployeeId });
                            setDeptHeadModal(record);
                          }}
                        >
                          Set Head
                        </Button>
                        <Popconfirm
                          title="Delete this department?"
                          onConfirm={async () => {
                            await deleteDept(record.id);
                            message.success("Department deleted");
                          }}
                        >
                          <Button size="small" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
            </div>
          </TabPane>

          {/* TAB 3: DESIGNATIONS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <IdcardOutlined className="text-purple-600" />
                Designations ({designations.length})
              </span>
            }
            key="designations"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Job Positions & Designations</span>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setDesigModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 border-none"
                >
                  Add Designation
                </Button>
              </div>

              <Table
                dataSource={designations}
                rowKey="id"
                loading={desigLoading}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Designation Title",
                    dataIndex: "name",
                    key: "name",
                    render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
                  },
                  {
                    title: "Department",
                    dataIndex: ["department", "name"],
                    key: "department",
                    render: (dept: string) => <Tag color="blue">{dept || "General"}</Tag>,
                  },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    render: (desc: string) => <span className="text-gray-500 text-xs">{desc || "N/A"}</span>,
                  },
                  {
                    title: "Action",
                    key: "action",
                    align: "center",
                    render: (_: any, record: any) => (
                      <Popconfirm
                        title="Delete this designation?"
                        onConfirm={async () => {
                          await deleteDesig(record.id);
                          message.success("Designation deleted");
                        }}
                      >
                        <Button size="small" danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            </div>
          </TabPane>

          {/* TAB 4: LEAVE TYPES */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <CalendarOutlined className="text-orange-600" />
                Leave Policies ({leaveTypes.length})
              </span>
            }
            key="leaves"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Annual Leave Quota & Policy</span>
                <Space>
                  <Button onClick={() => { leaveTypeForm.setFieldsValue({ name: "Sick Leave", daysAllowedPerYear: 14, isPaid: true }); setLeaveTypeModal(true); }}>Add Sick Leave</Button>
                  <Button onClick={() => { leaveTypeForm.setFieldsValue({ name: "Casual Leave", daysAllowedPerYear: 10, isPaid: true }); setLeaveTypeModal(true); }}>Add Casual Leave</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setLeaveTypeModal(true)} className="bg-orange-600 hover:bg-orange-700 border-none">Add Leave Policy</Button>
                </Space>
              </div>

              <Table
                dataSource={leaveTypes}
                rowKey="id"
                loading={leaveTypeLoading}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Leave Type",
                    dataIndex: "name",
                    key: "name",
                    render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
                  },
                  {
                    title: "Quota (Days / Year)",
                    dataIndex: "daysAllowedPerYear",
                    key: "daysAllowedPerYear",
                    align: "center",
                    render: (d: number) => <span className="font-bold text-blue-700">{d || 14} Days</span>,
                  },
                  {
                    title: "Paid Leave?",
                    dataIndex: "isPaid",
                    key: "isPaid",
                    align: "center",
                    render: (paid: boolean) => (
                      <Tag color={paid !== false ? "green" : "volcano"}>
                        {paid !== false ? "Paid Leave" : "Unpaid Leave"}
                      </Tag>
                    ),
                  },
                  {
                    title: "Status",
                    dataIndex: "isActive",
                    key: "isActive",
                    align: "center",
                    render: (active: boolean) => (
                      <Tag color={active !== false ? "blue" : "default"}>
                        {active !== false ? "Active" : "Inactive"}
                      </Tag>
                    ),
                  },
                ]}
              />
            </div>
          </TabPane>

          {/* TAB 5: WORK SHIFTS */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 font-medium">
                <ClockCircleOutlined className="text-teal-600" />
                Work Shifts & Grace Periods ({shifts.length})
              </span>
            }
            key="shifts"
          >
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Office Working Hours & Shifts</span>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShiftModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 border-none"
                >
                  Add Work Shift
                </Button>
              </div>

              <Table
                dataSource={shifts}
                rowKey="id"
                loading={shiftLoading}
                pagination={{ pageSize: 8 }}
                columns={[
                  {
                    title: "Shift Name",
                    dataIndex: "name",
                    key: "name",
                    render: (name: string, r: any) => (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{name}</span>
                        {r.isDefault && <Tag color="green">Default Shift</Tag>}
                      </div>
                    ),
                  },
                  {
                    title: "Start Time",
                    dataIndex: "startTime",
                    key: "startTime",
                    render: (t: string) => <span className="font-mono text-emerald-700 font-medium">{t}</span>,
                  },
                  {
                    title: "End Time",
                    dataIndex: "endTime",
                    key: "endTime",
                    render: (t: string) => <span className="font-mono text-blue-700 font-medium">{t}</span>,
                  },
                  {
                    title: "Grace Period",
                    dataIndex: "graceMinutes",
                    key: "graceMinutes",
                    align: "center",
                    render: (m: number) => <Tag color="orange">{m || 15} Mins</Tag>,
                  },
                  {
                    title: "Full Day Hours",
                    dataIndex: "fullDayHours",
                    key: "fullDayHours",
                    align: "center",
                    render: (h: number) => <span className="font-bold">{h || 8} hrs</span>,
                  },
                ]}
              />
            </div>
          </TabPane>
          <TabPane tab={<span className="flex items-center gap-2 font-medium"><CalendarOutlined className="text-rose-600" />Holiday Calendar ({holidays.length})</span>} key="holidays">
            <div className="space-y-4 pt-2"><Alert type="info" showIcon message="Holiday approval workflow" description="HR creates a holiday request and selects an approver. Only approved holidays appear on employee calendars." /><div className="flex justify-between items-center"><span className="text-sm font-semibold text-gray-700">Company Holidays & Weekly Off Days</span><Button type="primary" icon={<PlusOutlined />} onClick={() => setHolidayModal(true)} className="bg-rose-600 border-none">Add Holiday</Button></div><Table loading={holidayLoading} dataSource={holidays} rowKey="id" pagination={{ pageSize: 8 }} columns={[{ title: "Holiday", dataIndex: "name" }, { title: "From", dataIndex: "fromDate" }, { title: "To", dataIndex: "toDate" }, { title: "Type", dataIndex: "holidayType", render: (v) => <Tag color="magenta">{v}</Tag> }, { title: "Pending with", render: (_: any, row: any) => { const approver = (employeesData?.data || []).find((employee: any) => employee.id === row.approverEmployeeId); return approver ? <div><b>{approver.fullName}</b><div className="text-xs text-gray-500">{approver.designation?.name || "Approver"}</div></div> : <Tag color="default">Not assigned</Tag>; } }, { title: "Status", dataIndex: "approvalStatus", render: (v) => <Tag color={v === "Approved" ? "green" : v === "Rejected" ? "red" : "orange"}>{v || "Pending"}</Tag> }, { title: "Action", render: (_: any, row: any) => <Popconfirm title="Delete this holiday?" onConfirm={async () => { await deleteHoliday(row.id).unwrap(); message.success("Holiday deleted"); refetchHolidays(); }}><Button type="link" danger>Delete</Button></Popconfirm> }]} /></div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal title="Create Holiday Request" open={holidayModal} footer={null} onCancel={() => setHolidayModal(false)} destroyOnClose><Form form={holidayForm} layout="vertical" onFinish={saveHoliday}><Form.Item name="name" label="Holiday Name" rules={[{ required: true }]}><Input placeholder="e.g. Independence Day" /></Form.Item><Row gutter={12}><Col span={12}><Form.Item name="fromDate" label="From Date" rules={[{ required: true }]}><Input type="date" /></Form.Item></Col><Col span={12}><Form.Item name="toDate" label="To Date" rules={[{ required: true }]}><Input type="date" /></Form.Item></Col></Row><Form.Item name="approverEmployeeId" label="Approver" rules={[{ required: true, message: "Select who will approve this holiday" }]}><Select showSearch optionFilterProp="label" options={(employeesData?.data || []).filter((e: any) => e.userId).map((e: any) => ({ value: e.id, label: `${e.fullName} (${e.designation?.name || "Employee"})` }))} placeholder="Select CEO, CCO or any authorized employee" /></Form.Item><Form.Item name="holidayType" label="Holiday Type" initialValue="Public Holiday"><Select options={["Public Holiday", "Festival / Religious", "Company Special", "Weekly Weekend"].map(value => ({ value, label: value }))} /></Form.Item><Form.Item name="description" label="Description"><Input.TextArea rows={2} /></Form.Item><Space className="w-full justify-end"><Button onClick={() => setHolidayModal(false)}>Cancel</Button><Button htmlType="submit" type="primary">Send for Approval</Button></Space></Form></Modal>

      {/* MODAL 1: REGISTER BIOMETRIC DEVICE */}
      <Modal
        title="Register New Biometric Attendance Device"
        open={deviceModal}
        onCancel={() => setDeviceModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={deviceForm} layout="vertical" onFinish={handleRegisterDevice}>
          <Form.Item
            name="name"
            label="Device Friendly Name"
            rules={[{ required: true, message: "Please enter device name" }]}
          >
            <Input placeholder="e.g. Head Office Main Entrance, Warehouse Door 1" />
          </Form.Item>

          <Form.Item name="deviceModel" label="Hardware Model / Manufacturer">
            <Select placeholder="Select or type model">
              <Option value="ZKTeco K40 / iClock">ZKTeco (K40, MB20, iClock Series)</Option>
              <Option value="Hikvision DS-K1T804">Hikvision Facial / Fingerprint</Option>
              <Option value="Realtime T52 / BioStation">Realtime / Suprema BioStation</Option>
              <Option value="Universal HTTP Webhook">Universal Cloud HTTP Push</Option>
            </Select>
          </Form.Item>

          <Form.Item name="deviceSerial" label="Hardware Serial Number">
            <Input placeholder="e.g. ZK-2026-X800" />
          </Form.Item>

          <Form.Item name="location" label="Location / Branch">
            <Input placeholder="e.g. Dhaka Head Office, Chittagong Hub" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="ipAddress" label="Static IP (Optional)">
              <Input placeholder="192.168.1.201" />
            </Form.Item>
            <Form.Item name="port" label="Port" initialValue={4370}>
              <InputNumber className="w-full" placeholder="4370" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setDeviceModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-emerald-600 hover:bg-emerald-700 border-none">
              Register Device & Generate Key
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 2: TEST PUNCH SIMULATOR */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-emerald-800">
            <PlayCircleOutlined className="text-emerald-600" />
            Live Biometric Punch Simulator
          </span>
        }
        open={simModal}
        onCancel={() => setSimModal(false)}
        footer={null}
        destroyOnClose
      >
        <Alert
          message="Simulate Biometric Machine Hardware Push"
          description="Test pushing attendance logs for any employee's Biometric User ID directly to verify real-time clock-in and late calculations."
          type="info"
          showIcon
          className="mb-4"
        />

        <Form form={simForm} layout="vertical" onFinish={handleSimulatePunch}>
          <Form.Item
            name="apiKey"
            label="Device API Key"
            initialValue={devices[0]?.apiKey}
            rules={[{ required: true, message: "Please select/enter device API key" }]}
          >
            <Select placeholder="Select device">
              {devices.map((d: any) => (
                <Option key={d.id} value={d.apiKey}>
                  {d.name} ({d.apiKey.substring(0, 16)}...)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="biometricUserId"
            label="Biometric User ID / Employee"
            rules={[{ required: true, message: "Please select employee or enter machine ID" }]}
          >
            <Select
              placeholder="Select employee to simulate punch"
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.biometricUserId || emp.employeeCode}>
                  {emp.fullName} ({emp.employeeCode} - Bio ID: {emp.biometricUserId || "Not assigned"})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="punchType" label="Punch Direction" initialValue="CheckIn">
              <Select>
                <Option value="CheckIn">Clock In (Check-In)</Option>
                <Option value="CheckOut">Clock Out (Check-Out)</Option>
                <Option value="Auto">Auto Detect</Option>
              </Select>
            </Form.Item>

            <Form.Item name="verifyType" label="Verification Mode" initialValue="Fingerprint">
              <Select>
                <Option value="Fingerprint">Fingerprint Sensor</Option>
                <Option value="Face">Facial Recognition</Option>
                <Option value="Card">RFID Card</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setSimModal(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSyncing}
              className="bg-emerald-600 hover:bg-emerald-700 border-none"
            >
              Push Test Punch
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 3: ADD DEPARTMENT */}
      <Modal
        title={editingDept ? "Edit Department" : "Add New Department"}
        open={deptModal}
        onCancel={() => { setDeptModal(false); setEditingDept(null); }}
        footer={null}
        destroyOnClose
      >
        <Form form={deptForm} layout="vertical" onFinish={handleCreateDept}>
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input placeholder="e.g. Human Resources, Sales & Marketing, IT" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Department overview..." />
          </Form.Item>

          <Form.Item name="weeklyOffDays" label="Weekly Off Days" initialValue={[5]} tooltip="Choose the days this department does not normally work.">
            <Select mode="multiple" placeholder="Select weekly holidays" options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((label, value) => ({ label, value }))} />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setDeptModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 border-none">
              {editingDept ? "Update Department" : "Save Department"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL: SET DEPARTMENT HEAD */}
      <Modal
        title={`Set Department Head — ${deptHeadModal?.name || ""}`}
        open={Boolean(deptHeadModal)}
        onCancel={() => setDeptHeadModal(null)}
        footer={null}
        destroyOnClose
      >
        <Alert
          type="info"
          showIcon
          className="mb-4"
          message="This person is the first-stage approver"
          description="Leave, Expense, Overtime and Attendance Correction requests from employees in this department will go to this person first, before final approval."
        />
        <Form form={deptHeadForm} layout="vertical" onFinish={handleSetDeptHead}>
          <Form.Item name="headEmployeeId" label="Department Head">
            <Select
              placeholder="Select employee"
              allowClear
              showSearch
              filterOption={(input, option: any) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.employeeCode}) {emp.userId ? "✓ has login" : "— no login yet"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.headEmployeeId !== cur.headEmployeeId}>
            {({ getFieldValue }) => {
              const selected = employees.find((e: any) => e.id === getFieldValue("headEmployeeId"));
              return selected && !selected.userId ? (
                <Alert
                  type="warning"
                  showIcon
                  className="mb-4"
                  message={`${selected.fullName} has no login account yet`}
                  description="They can be set as Department Head, but won't be able to actually click Approve until you link a login for them under HR > Employee Directory > Edit > Approval & Access."
                />
              ) : null;
            }}
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setDeptHeadModal(null)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 border-none">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 4: ADD DESIGNATION */}
      <Modal
        title="Add New Designation"
        open={desigModal}
        onCancel={() => setDesigModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={desigForm} layout="vertical" onFinish={handleCreateDesig}>
          <Form.Item
            name="name"
            label="Designation Title"
            rules={[{ required: true, message: "Please enter designation title" }]}
          >
            <Input placeholder="e.g. Senior Software Engineer, HR Executive, Sales Manager" />
          </Form.Item>

          <Form.Item name="departmentId" label="Department">
            <Select placeholder="Select department">
              {departments.map((d: any) => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Job role overview..." />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setDesigModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-purple-600 hover:bg-purple-700 border-none">
              Save Designation
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 5: ADD LEAVE POLICY */}
      <Modal
        title="Add Annual Leave Policy"
        open={leaveTypeModal}
        onCancel={() => setLeaveTypeModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={leaveTypeForm} layout="vertical" onFinish={handleCreateLeaveType}>
          <Form.Item
            name="name"
            label="Leave Type Name"
            rules={[{ required: true, message: "Please enter leave type name" }]}
          >
            <Input placeholder="e.g. Casual Leave, Sick Leave, Annual/Earned Leave, Maternity Leave" />
          </Form.Item>

          <Form.Item
            name="daysAllowedPerYear"
            label="Annual Allowed Quota (Days)"
            initialValue={14}
            rules={[{ required: true, message: "Please enter quota days" }]}
          >
            <InputNumber min={1} max={365} className="w-full" />
          </Form.Item>

          <Form.Item name="isPaid" label="Paid Leave?" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Paid" unCheckedChildren="Unpaid" />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setLeaveTypeModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-600 hover:bg-orange-700 border-none">
              Save Policy
            </Button>
          </div>
        </Form>
      </Modal>

      {/* MODAL 6: ADD WORK SHIFT */}
      <Modal
        title="Add Company Work Shift"
        open={shiftModal}
        onCancel={() => setShiftModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={shiftForm} layout="vertical" onFinish={handleCreateShift}>
          <Form.Item
            name="name"
            label="Shift Schedule Name"
            rules={[{ required: true, message: "Please enter shift name" }]}
          >
            <Input placeholder="e.g. General Office Shift (09:00 - 18:00)" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="startTime" label="Shift Start Time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>

            <Form.Item name="endTime" label="Shift End Time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Form.Item name="graceMinutes" label="Late Grace (Mins)" initialValue={15}>
              <InputNumber min={0} max={60} className="w-full" />
            </Form.Item>

            <Form.Item name="fullDayHours" label="Full Day (Hrs)" initialValue={8}>
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>

            <Form.Item name="halfDayHours" label="Half Day (Hrs)" initialValue={4}>
              <InputNumber min={1} max={12} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="isDefault" label="Set as Default Shift?" valuePropName="checked">
            <Switch />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setShiftModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-teal-600 hover:bg-teal-700 border-none">
              Save Work Shift
            </Button>
          </div>
        </Form>
      </Modal>

      {/* DRAWER: USERS ON DEVICE (CHECK-IN / CHECK-OUT) */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined className="text-purple-600" />
            <span>{usersDrawerDevice?.name || "Device"} — Today's Punches</span>
          </div>
        }
        open={Boolean(usersDrawerDevice)}
        onClose={() => setUsersDrawerDevice(null)}
        width={480}
        destroyOnClose
      >
        {usersDrawerDevice && (
          <div className="space-y-4">
            <Alert
              type={usersDrawerDevice.isOnline ? "success" : "warning"}
              showIcon
              message={usersDrawerDevice.isOnline ? "Device is currently online" : "Device is currently offline"}
              description={
                usersDrawerDevice.isOnline
                  ? `Last connected: ${formatBD(usersDrawerDevice.lastSyncAt)} (BD time)`
                  : usersDrawerDevice.lastConnectionError || "This device has not synced successfully yet. Try 'Sync Now' from the device table."
              }
            />

            <Row gutter={12}>
              <Col span={12}>
                <Card size="small" className="text-center rounded-lg bg-cyan-50 border-cyan-200">
                  <div className="text-2xl font-bold text-cyan-700">
                    {deviceUsersData?.data?.totalPunchesToday ?? 0}
                  </div>
                  <div className="text-[11px] text-cyan-800 uppercase font-semibold">Total Punches Today</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="text-center rounded-lg bg-purple-50 border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">
                    {deviceUsersData?.data?.users?.length ?? 0}
                  </div>
                  <div className="text-[11px] text-purple-800 uppercase font-semibold">People Punched Today</div>
                </Card>
              </Col>
            </Row>

            <Tabs activeKey={usersDrawerTab} onChange={setUsersDrawerTab} size="small">
              <TabPane tab="Punched Today" key="punched">
                {deviceUsersLoading ? (
                  <div className="text-center text-gray-400 py-10 text-sm">Loading punches...</div>
                ) : deviceUsersData?.data?.users?.length ? (
                  <div className="space-y-3">
                    {deviceUsersData.data.users.map((u: any, idx: number) => (
                      <Card key={idx} size="small" className="rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-gray-900 block text-sm">
                              {u.employee?.fullName || `Unmapped ID: ${u.biometricUserId}`}
                            </span>
                            <span className="text-xs text-gray-400">
                              {u.employee?.department?.name || (u.matched ? "Staff" : "No employee mapped to this biometric ID")}
                            </span>
                          </div>
                          {!u.matched && <Tag color="orange">Unmapped</Tag>}
                        </div>
                        <Divider className="my-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span>
                            <span className="text-gray-400">Check In: </span>
                            <span className="font-mono font-semibold text-emerald-700">
                              {u.checkInTime ? formatBD(u.checkInTime, "HH:mm:ss") : "-"}
                            </span>
                          </span>
                          <span>
                            <span className="text-gray-400">Check Out: </span>
                            <span className="font-mono font-semibold text-blue-700">
                              {u.checkOutTime ? formatBD(u.checkOutTime, "HH:mm:ss") : "-"}
                            </span>
                          </span>
                          <Tag color="cyan">{u.totalPunches} punch{u.totalPunches > 1 ? "es" : ""}</Tag>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty description="No punches received from this device today yet" />
                )}
              </TabPane>

              <TabPane tab="Enrolled on Device" key="enrolled">
                <p className="text-xs text-gray-500 mb-3">
                  This connects to the machine live and lists every fingerprint/user actually registered on it —
                  regardless of whether they punched today.
                </p>
                {enrolledUsersLoading ? (
                  <div className="text-center text-gray-400 py-10 text-sm">Connecting to device...</div>
                ) : enrolledUsersData?.success === false ? (
                  <Alert type="error" showIcon message="Could not read device user list" description={enrolledUsersData?.message} />
                ) : enrolledUsersData?.data?.users?.length ? (
                  <div className="space-y-2">
                    {enrolledUsersData.data.users.map((u: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                        <div>
                          <span className="font-semibold text-gray-900 text-sm block">{u.name}</span>
                          <span className="text-xs text-gray-400 font-mono">Device ID: {u.deviceUserId}</span>
                        </div>
                        {u.matched ? (
                          <Tag color="green">{u.employee?.fullName}</Tag>
                        ) : (
                          <Tag color="orange">Not mapped in ERP</Tag>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty description="No users found on device" />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>
    </div>
  );
}
