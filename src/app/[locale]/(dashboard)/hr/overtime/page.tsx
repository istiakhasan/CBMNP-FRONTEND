"use client";

import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message } from "antd";
import { CheckOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useApproveOvertimeRequestMutation,
  useGetEmployeesQuery,
  useGetOvertimeRequestsQuery,
  useSubmitOvertimeRequestMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function OvertimePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data, isLoading, refetch } = useGetOvertimeRequestsQuery(undefined);
  const [submitOvertime, { isLoading: isSubmitting }] = useSubmitOvertimeRequestMutation();
  const [approveOvertime] = useApproveOvertimeRequestMutation();

  const employees = employeesData?.data || [];
  const overtimeRows = data?.data || [];

  const handleSubmit = async (values: any) => {
    try {
      await submitOvertime({ ...values, overtimeDate: values.overtimeDate?.format("YYYY-MM-DD") }).unwrap();
      message.success("Overtime request submitted");
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to submit overtime");
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await approveOvertime({ id, approved }).unwrap();
      message.success(`Overtime ${approved ? "approved" : "rejected"}`);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update overtime");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Overtime Management" />
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Overtime Requests"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} className="bg-emerald-600 border-none">Add Overtime</Button>
          </Space>
        }
      >
        <Table
          loading={isLoading}
          dataSource={overtimeRows}
          rowKey="id"
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee", render: (v: string, r: any) => v || r.employee?.name },
            { title: "Date", dataIndex: "overtimeDate", key: "date" },
            { title: "Hours", dataIndex: "hours", key: "hours", align: "center" as const },
            { title: "Reason", dataIndex: "reason", key: "reason" },
            { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Approved" ? "green" : v === "Rejected" ? "red" : "orange"}>{v || "Pending"}</Tag> },
            {
              title: "Action",
              key: "action",
              render: (_: any, record: any) => (
                <Space>
                  <Button size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id, true)}>Approve</Button>
                  <Button size="small" danger onClick={() => handleApprove(record.id, false)}>Reject</Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal title="Submit Overtime" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" optionFilterProp="children">
              {employees.map((emp: any) => <Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="overtimeDate" label="Overtime Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="hours" label="Hours" rules={[{ required: true }]}>
            <InputNumber min={0.5} step={0.5} className="w-full" />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} className="bg-emerald-600 border-none">Save</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
