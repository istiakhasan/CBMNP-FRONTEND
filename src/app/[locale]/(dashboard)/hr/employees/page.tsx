"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function EmployeesPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetEmployeesQuery(undefined);
  const { data: deptsData } = useGetDepartmentsQuery(undefined);
  const { data: desigsData } = useGetDesignationsQuery(undefined);

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        joiningDate: values.joiningDate ? values.joiningDate.format("YYYY-MM-DD") : undefined,
      };
      await createEmployee(payload).unwrap();
      message.success("Employee profile created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create employee");
    }
  };

  const employees = data?.data || [];
  const departments = deptsData?.data || [];
  const designations = desigsData?.data || [];

  const columns: any = [
    {
      title: "Employee ID",
      dataIndex: "employeeCode",
      key: "employeeCode",
      render: (code: string) => <span className="font-bold text-blue-600">{code}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-400 block">{record.email || "No email"}</span>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      render: (d: string) => <Tag color="blue">{d || "Unassigned"}</Tag>,
    },
    {
      title: "Designation",
      dataIndex: ["designation", "name"],
      key: "designation",
      render: (d: string) => <Tag color="geekblue">{d || "Staff"}</Tag>,
    },
    {
      title: "Basic Salary (Tk)",
      dataIndex: "basicSalary",
      key: "basicSalary",
      align: "right" as const,
      render: (amt: number) => (
        <span className="font-semibold">
          {Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Active" ? "green" : st === "Probation" ? "orange" : "default"}>{st}</Tag>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Employee Master Directory" />

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-blue-500 shadow-sm">
            <Statistic title="Total Employees" value={employees.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="border-l-4 border-emerald-500 shadow-sm">
            <Statistic
              title="Active Staff"
              value={employees.filter((e: any) => e.status === "Active").length}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Staff Directory"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Add Employee
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={employees} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Add New Employee"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ status: "Active", joiningDate: dayjs(), basicSalary: 25000 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="employeeCode" label="Employee ID / Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. EMP-001" />
            </Form.Item>

            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Istiak Ahmed" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="e.g. 01711000000" />
            </Form.Item>

            <Form.Item name="email" label="Email Address">
              <Input placeholder="e.g. istiak@company.com" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="departmentId" label="Department">
              <Select placeholder="Select Department">
                {departments.map((d: any) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="designationId" label="Designation">
              <Select placeholder="Select Designation">
                {designations.map((d: any) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="basicSalary" label="Basic Salary (Tk)" rules={[{ required: true }]}>
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>

            <Form.Item name="joiningDate" label="Joining Date">
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
