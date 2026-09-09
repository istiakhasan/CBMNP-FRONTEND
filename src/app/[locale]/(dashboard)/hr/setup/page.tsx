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
} from "@ant-design/icons";
import dayjs from "dayjs";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
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
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";

const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Paragraph } = Typography;

export default function HrSetupPage() {
  const [activeTab, setActiveTab] = useState("biometric");

  // Modals
  const [deptModal, setDeptModal] = useState(false);
  const [desigModal, setDesigModal] = useState(false);
  const [leaveTypeModal, setLeaveTypeModal] = useState(false);
  const [shiftModal, setShiftModal] = useState(false);
  const [deviceModal, setDeviceModal] = useState(false);
  const [simModal, setSimModal] = useState(false);

  // Forms
  const [deptForm] = Form.useForm();
  const [desigForm] = Form.useForm();
  const [leaveTypeForm] = Form.useForm();
  const [shiftForm] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [simForm] = Form.useForm();

  // Queries
  const { data: deptData, isLoading: deptLoading, refetch: refetchDept } = useGetDepartmentsQuery(undefined);
  const { data: desigData, isLoading: desigLoading, refetch: refetchDesig } = useGetDesignationsQuery(undefined);
  const { data: leaveTypeData, isLoading: leaveTypeLoading, refetch: refetchLeaveType } = useGetLeaveTypesQuery(undefined);
  const { data: shiftData, isLoading: shiftLoading, refetch: refetchShift } = useGetShiftsQuery(undefined);
  const { data: deviceData, isLoading: deviceLoading, refetch: refetchDevice } = useGetBiometricDevicesQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  // Mutations
  const [createDept] = useCreateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();
  const [createDesig] = useCreateDesignationMutation();
  const [deleteDesig] = useDeleteDesignationMutation();
  const [createLeaveType] = useCreateLeaveTypeMutation();
  const [createShift] = useCreateShiftMutation();
  const [registerDevice] = useRegisterBiometricDeviceMutation();
  const [regenerateKey] = useRegenerateDeviceKeyMutation();
  const [deleteDevice] = useDeleteBiometricDeviceMutation();
  const [syncPunch, { isLoading: isSyncing }] = useSyncBiometricPunchMutation();

  const departments = deptData?.data || [];
  const designations = desigData?.data || [];
  const leaveTypes = leaveTypeData?.data || [];
  const shifts = shiftData?.data || [];
  const devices = deviceData?.data || [];
  const employees = employeesData?.data || [];

  // Handlers
  const handleCreateDept = async (values: any) => {
    try {
      await createDept(values).unwrap();
      message.success("Department created successfully");
      setDeptModal(false);
      deptForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create department");
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
                    title: "Last Sync",
                    dataIndex: "lastSyncAt",
                    key: "lastSyncAt",
                    render: (dt: string) => (
                      <span className="text-xs text-gray-500">
                        {dt ? dayjs(dt).format("YYYY-MM-DD HH:mm:ss") : "Never"}
                      </span>
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
                      <Popconfirm
                        title="Delete this device?"
                        onConfirm={() => handleDeleteDevice(record.id)}
                      >
                        <Button size="small" danger>
                          Delete
                        </Button>
                      </Popconfirm>
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
                  onClick={() => setDeptModal(true)}
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
                    title: "Action",
                    key: "action",
                    align: "center",
                    render: (_: any, record: any) => (
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setLeaveTypeModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 border-none"
                >
                  Add Leave Policy
                </Button>
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
        </Tabs>
      </Card>

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
        title="Add New Department"
        open={deptModal}
        onCancel={() => setDeptModal(false)}
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

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={() => setDeptModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 border-none">
              Save Department
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
    </div>
  );
}
