"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  useGetAttendanceQuery,
  useClockInMutation,
  useClockOutMutation,
  useGetEmployeesQuery,
} from "@/redux/api/hrPayrollApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function AttendancePage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetAttendanceQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);

  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut] = useClockOutMutation();

  const handleClockIn = async (values: any) => {
    try {
      await clockIn(values).unwrap();
      message.success("Employee attendance clock-in recorded");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to clock in");
    }
  };

  const handleClockOut = async (employeeId: string) => {
    try {
      await clockOut({ employeeId }).unwrap();
      message.success("Employee clock-out recorded");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to clock out");
    }
  };

  const records = data?.data || [];
  const employees = employeesData?.data || [];

  const columns: any = [
    {
      title: "Date",
      dataIndex: "attendanceDate",
      key: "attendanceDate",
    },
    {
      title: "Employee",
      dataIndex: ["employee", "fullName"],
      key: "employee",
      render: (name: string, record: any) => (
        <div>
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-400 block">{record.employee?.employeeCode}</span>
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
      render: (t: string) => <span className="font-mono text-emerald-700 font-medium">{t || "-"}</span>,
    },
    {
      title: "Clock Out",
      dataIndex: "clockOutTime",
      key: "clockOutTime",
      render: (t: string) => <span className="font-mono text-blue-700 font-medium">{t || "-"}</span>,
    },
    {
      title: "Late Minutes",
      dataIndex: "lateMinutes",
      key: "lateMinutes",
      render: (mins: number) => (
        <span className={mins > 0 ? "text-rose-600 font-bold" : "text-gray-400"}>
          {mins > 0 ? `${mins} mins` : "On Time"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => (
        <Tag color={st === "Present" ? "green" : st === "Late" ? "orange" : "volcano"}>{st}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {!record.clockOutTime && (
            <Button size="small" onClick={() => handleClockOut(record.employeeId)}>
              Clock Out
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Daily Attendance & Clock-In Tracking" />

      <Card
        title="Attendance Records"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Record Clock-In
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={records} rowKey="id" loading={isLoading} pagination={{ pageSize: 15 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Record Employee Clock-In"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isClockingIn}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleClockIn}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select placeholder="Select Employee" showSearch optionFilterProp="children">
              {employees.map((e: any) => (
                <Option key={e.id} value={e.id}>
                  {e.fullName} ({e.employeeCode})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
