"use client";

import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message } from "antd";
import { CheckOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useApproveTransferMutation,
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
  useGetTransfersQuery,
  useRecordTransferMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function TransfersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data: departmentsData } = useGetDepartmentsQuery(undefined);
  const { data, isLoading, refetch } = useGetTransfersQuery(undefined);
  const [recordTransfer, { isLoading: isSaving }] = useRecordTransferMutation();
  const [approveTransfer] = useApproveTransferMutation();

  const employees = employeesData?.data || [];
  const departments = departmentsData?.data || [];
  const transfers = data?.data || [];

  const handleSubmit = async (values: any) => {
    try {
      await recordTransfer({ ...values, effectiveDate: values.effectiveDate?.format("YYYY-MM-DD") }).unwrap();
      message.success("Transfer recorded");
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to record transfer");
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await approveTransfer({ id, approved }).unwrap();
      message.success(`Transfer ${approved ? "approved" : "rejected"}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update transfer");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Employee Transfers" />
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Transfer Requests"
        extra={<Space><Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} className="bg-emerald-600 border-none">Record Transfer</Button></Space>}
      >
        <Table
          loading={isLoading}
          dataSource={transfers}
          rowKey="id"
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee", render: (v: string, r: any) => v || r.employee?.name },
            { title: "From", dataIndex: ["fromDepartment", "name"], key: "from", render: (v: string) => v || "-" },
            { title: "To", dataIndex: ["toDepartment", "name"], key: "to", render: (v: string, r: any) => v || r.department?.name || "-" },
            { title: "Effective Date", dataIndex: "effectiveDate", key: "effectiveDate" },
            { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Approved" ? "green" : v === "Rejected" ? "red" : "orange"}>{v || "Pending"}</Tag> },
            { title: "Action", key: "action", render: (_: any, r: any) => <Space><Button size="small" icon={<CheckOutlined />} onClick={() => handleApprove(r.id, true)}>Approve</Button><Button size="small" danger onClick={() => handleApprove(r.id, false)}>Reject</Button></Space> },
          ]}
        />
      </Card>

      <Modal title="Record Employee Transfer" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" optionFilterProp="children">
              {employees.map((emp: any) => <Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="toDepartmentId" label="New Department" rules={[{ required: true }]}>
            <Select placeholder="Select department">{departments.map((dept: any) => <Option key={dept.id} value={dept.id}>{dept.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="effectiveDate" label="Effective Date" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="reason" label="Reason"><Input.TextArea rows={3} /></Form.Item>
          <div className="flex justify-end gap-2"><Button onClick={() => setModalOpen(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSaving} className="bg-emerald-600 border-none">Save</Button></div>
        </Form>
      </Modal>
    </div>
  );
}
