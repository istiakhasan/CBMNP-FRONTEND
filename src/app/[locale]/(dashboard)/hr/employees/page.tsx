"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
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
  Avatar,
  Divider,
  Popconfirm,
  Badge,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ApiOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useGetEmployeeByIdQuery,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;
const { TabPane } = Tabs;

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  // Drawers
  const [createDrawer, setCreateDrawer] = useState(false);
  const [detailsDrawer, setDetailsDrawer] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

  // Forms
  const [form] = Form.useForm();

  // Queries
  const { data, isLoading, refetch } = useGetEmployeesQuery({
    search: search || undefined,
    departmentId: selectedDept || undefined,
    status: selectedStatus || undefined,
  });
  const { data: deptData } = useGetDepartmentsQuery(undefined);
  const { data: desigData } = useGetDesignationsQuery(undefined);
  const { data: empDetailsData, isLoading: detailsLoading } = useGetEmployeeByIdQuery(
    selectedEmpId as string,
    { skip: !selectedEmpId }
  );

  // Mutations
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const employees = data?.data || [];
  const departments = deptData?.data || [];
  const designations = desigData?.data || [];
  const emp360 = empDetailsData?.data;

  // Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e: any) => e.status === "Active").length;
  const biometricMappedCount = employees.filter((e: any) => Boolean(e.biometricUserId)).length;

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    form.resetFields();
    setCreateDrawer(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingEmployee(record);
    form.setFieldsValue({
      ...record,
    });
    setCreateDrawer(true);
  };

  const handleOpenDetails = (id: string) => {
    setSelectedEmpId(id);
    setDetailsDrawer(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingEmployee) {
        await updateEmployee({ id: editingEmployee.id, ...values }).unwrap();
        message.success("Employee profile updated successfully");
      } else {
        await createEmployee(values).unwrap();
        message.success("Employee profile created successfully");
      }
      setCreateDrawer(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save employee profile");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id).unwrap();
      message.success("Employee removed successfully");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete employee");
    }
  };

  const columns: any = [
    {
      title: "Employee",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            className="bg-emerald-600 font-bold"
            icon={<UserOutlined />}
          >
            {name?.charAt(0)}
          </Avatar>
          <div>
            <span className="font-semibold text-gray-900 block text-sm">{name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono font-medium">{record.employeeCode}</span>
              {record.biometricUserId && (
                <Tag color="cyan" className="text-[10px] font-mono px-1 py-0 m-0">
                  <ApiOutlined className="mr-0.5" /> Bio ID: {record.biometricUserId}
                </Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Department & Role",
      key: "dept_role",
      render: (_: any, record: any) => (
        <div>
          <span className="font-medium text-gray-800 block text-xs">
            {record.designation?.name || "General Staff"}
          </span>
          <Tag color="blue" className="text-[11px] mt-0.5">
            {record.department?.name || "General"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: any) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-gray-700">
            <PhoneOutlined className="text-emerald-600" />
            <span>{record.phone}</span>
          </div>
          {record.email && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <MailOutlined className="text-gray-400" />
              <span>{record.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Salary & Pay",
      key: "salary",
      render: (_: any, record: any) => (
        <div>
          <span className="font-bold text-gray-900 text-xs block">
            ৳{Number(record.basicSalary || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-gray-400">{record.paymentMethod || "Bank"}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "employmentType",
      key: "employmentType",
      align: "center" as const,
      render: (t: string) => <Tag color="purple">{t || "Full-time"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Active" ? "green" : st === "Probation" ? "orange" : "volcano"}>
          {st || "Active"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetails(record.id)}
            className="text-blue-600 hover:text-blue-700"
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            className="text-emerald-600 hover:text-emerald-700"
          />
          <Popconfirm
            title="Delete employee profile?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Employee 360° Directory & Master Profiles" />

      {/* KPI Stats Bar */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Total Employees</span>}
              value={totalEmployees}
              prefix={<TeamOutlined className="text-blue-600" />}
              valueStyle={{ fontWeight: "bold", color: "#1e293b" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Active Workforce</span>}
              value={activeEmployees}
              prefix={<CheckCircleOutlined className="text-emerald-600" />}
              valueStyle={{ fontWeight: "bold", color: "#059669" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Biometric Machine Mapped</span>}
              value={biometricMappedCount}
              prefix={<ApiOutlined className="text-cyan-600" />}
              valueStyle={{ fontWeight: "bold", color: "#0891b2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card className="rounded-xl border border-gray-200 shadow-sm">
            <Statistic
              title={<span className="text-xs font-bold text-gray-500 uppercase">Departments</span>}
              value={departments.length}
              prefix={<BankOutlined className="text-purple-600" />}
              valueStyle={{ fontWeight: "bold", color: "#7c3aed" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table Card with Filter & Search */}
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by name, code, phone, or biometric ID..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 320 }}
                allowClear
              />
              <Select
                placeholder="Filter by Department"
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
              <Select
                placeholder="Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                allowClear
                style={{ width: 120 }}
              >
                <Option value="Active">Active</Option>
                <Option value="Probation">Probation</Option>
                <Option value="Resigned">Resigned</Option>
                <Option value="Terminated">Terminated</Option>
              </Select>
            </div>

            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenCreate}
                className="bg-emerald-600 hover:bg-emerald-700 border-none font-medium"
              >
                Add New Employee
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          dataSource={employees}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          className="custom_scroll"
        />
      </Card>

      {/* DRAWER 1: CREATE / EDIT EMPLOYEE (Multi-Tab Form) */}
      <Drawer
        title={
          <span className="font-bold text-base text-gray-900">
            {editingEmployee ? `Edit Employee: ${editingEmployee.fullName}` : "Create New Employee Profile"}
          </span>
        }
        width={720}
        open={createDrawer}
        onClose={() => setCreateDrawer(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            {/* TAB 1: Personal Info */}
            <TabPane tab="1. Personal Details" key="1">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter full name" }]}
                >
                  <Input placeholder="e.g. Istiak Ahmed" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input placeholder="e.g. 01712345678" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="email" label="Official / Personal Email">
                  <Input placeholder="istiak@cbmnp.com" />
                </Form.Item>

                <Form.Item name="nidNumber" label="National ID / Passport">
                  <Input placeholder="e.g. 199426925..." />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Form.Item name="gender" label="Gender">
                  <Select placeholder="Select">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="bloodGroup" label="Blood Group">
                  <Select placeholder="Blood Group">
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="maritalStatus" label="Marital Status">
                  <Select placeholder="Status">
                    <Option value="Single">Single</Option>
                    <Option value="Married">Married</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="presentAddress" label="Present Address">
                <Input.TextArea rows={2} placeholder="House, Road, Area, City..." />
              </Form.Item>

              <Form.Item name="permanentAddress" label="Permanent Address">
                <Input.TextArea rows={2} placeholder="Village, Post, Thana, District..." />
              </Form.Item>
            </TabPane>

            {/* TAB 2: Job & Biometric Machine ID */}
            <TabPane tab="2. Job & Biometric ID" key="2">
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="employeeCode"
                  label="Employee Code (Unique)"
                  rules={[{ required: true, message: "Please enter employee code" }]}
                >
                  <Input placeholder="e.g. EMP-001" />
                </Form.Item>

                <Form.Item
                  name="biometricUserId"
                  label={
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <ApiOutlined /> Biometric Machine User ID
                    </span>
                  }
                  tooltip="User ID registered on the physical Fingerprint/Facial Recognition attendance machine (e.g. 1001, 1002)"
                >
                  <Input placeholder="e.g. 1001" className="font-mono border-emerald-300" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="departmentId" label="Department">
                  <Select placeholder="Select department">
                    {departments.map((d: any) => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="designationId" label="Designation / Job Role">
                  <Select placeholder="Select designation">
                    {designations.map((d: any) => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Form.Item name="joiningDate" label="Joining Date">
                  <Input type="date" className="w-full" />
                </Form.Item>

                <Form.Item name="employmentType" label="Employment Type" initialValue="Full-time">
                  <Select>
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                    <Option value="Contractual">Contractual</Option>
                    <Option value="Intern">Intern</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Status" initialValue="Active">
                  <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Probation">Probation</Option>
                    <Option value="Resigned">Resigned</Option>
                    <Option value="Terminated">Terminated</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="reportingManagerId" label="Reporting Manager">
                <Select placeholder="Select supervisor" allowClear>
                  {employees
                    .filter((e: any) => e.id !== editingEmployee?.id)
                    .map((emp: any) => (
                      <Option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.employeeCode})
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </TabPane>

            {/* TAB 3: Salary & Bank/MFS Accounts */}
            <TabPane tab="3. Salary & Banking" key="3">
              <Form.Item
                name="basicSalary"
                label="Basic Monthly Salary (BDT ৳)"
                initialValue={25000}
                rules={[{ required: true, message: "Please enter basic salary" }]}
              >
                <InputNumber min={0} className="w-full font-bold text-emerald-700" prefix="৳" />
              </Form.Item>

              <Form.Item name="paymentMethod" label="Disbursement Method" initialValue="Bank Transfer">
                <Select>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                  <Option value="bKash / Nagad">bKash / Nagad (MFS)</Option>
                  <Option value="Cash">Cash</Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="bankName" label="Bank Name">
                  <Input placeholder="e.g. Dutch Bangla Bank, City Bank" />
                </Form.Item>

                <Form.Item name="bankAccountNo" label="Account Number">
                  <Input placeholder="123.151.XXXXXX" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="bankRoutingNo" label="Branch Routing Number">
                  <Input placeholder="e.g. 090271..." />
                </Form.Item>

                <Form.Item name="mfsNumber" label="bKash / Nagad Mobile Number">
                  <Input placeholder="017XXXXXXXX" />
                </Form.Item>
              </div>

              <Form.Item name="tinNumber" label="Tax Identification (e-TIN)">
                <Input placeholder="e.g. 123456789012" />
              </Form.Item>
            </TabPane>

            {/* TAB 4: Emergency Contacts */}
            <TabPane tab="4. Emergency Contact" key="4">
              <Form.Item name="emergencyContactName" label="Contact Person Full Name">
                <Input placeholder="e.g. Mrs. Fatema Begum" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="emergencyContactPhone" label="Contact Phone">
                  <Input placeholder="018XXXXXXXX" />
                </Form.Item>

                <Form.Item name="emergencyContactRelation" label="Relationship">
                  <Input placeholder="e.g. Spouse, Father, Mother, Brother" />
                </Form.Item>
              </div>
            </TabPane>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button onClick={() => setCreateDrawer(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700 border-none font-semibold px-6"
            >
              {editingEmployee ? "Update Profile" : "Create Employee"}
            </Button>
          </div>
        </Form>
      </Drawer>

      {/* DRAWER 2: EMPLOYEE 360° PROFILE DRAWER */}
      <Drawer
        title="Employee 360° Profile Overview"
        width={680}
        open={detailsDrawer}
        onClose={() => setDetailsDrawer(false)}
        loading={detailsLoading}
      >
        {emp360 && (
          <div className="space-y-6">
            {/* Header Profile Box */}
            <div className="flex items-center gap-4 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <Avatar size={64} className="bg-emerald-700 text-xl font-bold">
                {emp360.employee?.fullName?.charAt(0)}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{emp360.employee?.fullName}</h3>
                  <Tag color="green">{emp360.employee?.status}</Tag>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {emp360.employee?.designation?.name || "General Staff"} • {emp360.employee?.department?.name || "General"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Tag color="blue" className="font-mono text-xs">
                    Code: {emp360.employee?.employeeCode}
                  </Tag>
                  {emp360.employee?.biometricUserId && (
                    <Tag color="cyan" className="font-mono text-xs">
                      <ApiOutlined /> Machine Bio ID: {emp360.employee?.biometricUserId}
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            {/* Compensation & Bank Info */}
            <Card title="Salary & Compensation Structure" size="small" className="border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-[11px] text-gray-400 block uppercase font-bold">Basic</span>
                  <span className="text-sm font-bold text-gray-800">
                    ৳{Number(emp360.salaryStructure?.basicSalary || emp360.employee?.basicSalary || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-[11px] text-gray-400 block uppercase font-bold">House Rent</span>
                  <span className="text-sm font-bold text-emerald-700">
                    ৳{Number(emp360.salaryStructure?.houseRentAllowance || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-[11px] text-gray-400 block uppercase font-bold">Medical</span>
                  <span className="text-sm font-bold text-emerald-700">
                    ৳{Number(emp360.salaryStructure?.medicalAllowance || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-lg">
                  <span className="text-[11px] text-gray-400 block uppercase font-bold">Conveyance</span>
                  <span className="text-sm font-bold text-emerald-700">
                    ৳{Number(emp360.salaryStructure?.conveyanceAllowance || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Payment Mode: </span>
                  <span className="font-semibold text-gray-800">{emp360.employee?.paymentMethod || "Bank"}</span>
                </div>
                <div>
                  <span className="text-gray-400">Bank Account: </span>
                  <span className="font-mono font-semibold text-gray-800">
                    {emp360.employee?.bankAccountNo || emp360.employee?.mfsNumber || "N/A"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Leave Balance Summary */}
            <Card title="Leave Balances (Current Year)" size="small" className="border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                {emp360.leaveBalances?.map((lb: any) => (
                  <div key={lb.leaveTypeId} className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-center">
                    <span className="text-xs font-semibold text-blue-900 block truncate">{lb.leaveTypeName}</span>
                    <span className="text-lg font-bold text-blue-700">{lb.remainingDays}</span>
                    <span className="text-[10px] text-blue-500 block">/ {lb.totalAllowed} Allowed</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Attendance Logs */}
            <Card title="Recent Attendance Punch History" size="small" className="border-gray-200">
              <Table
                dataSource={emp360.recentAttendance || []}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  { title: "Date", dataIndex: "attendanceDate", key: "date" },
                  {
                    title: "Clock In",
                    dataIndex: "clockInTime",
                    key: "in",
                    render: (t: string) => <span className="font-mono text-emerald-700">{t || "-"}</span>,
                  },
                  {
                    title: "Clock Out",
                    dataIndex: "clockOutTime",
                    key: "out",
                    render: (t: string) => <span className="font-mono text-blue-700">{t || "-"}</span>,
                  },
                  {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (st: string) => <Tag color={st === "Present" ? "green" : "volcano"}>{st}</Tag>,
                  },
                ]}
              />
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
}
