"use client";

import React, { useState } from "react";
import { Button, Card, DatePicker, Descriptions, Drawer, Form, Input, Modal, Select, Space, Table, Tag, message } from "antd";
import { EyeOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useCreateDisciplinaryActionMutation,
  useGetDisciplinaryActionsQuery,
  useGetEmployeesQuery,
  useUpdateDisciplinaryActionMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function DisciplinaryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const { data, isLoading, refetch } = useGetDisciplinaryActionsQuery(undefined);
  const [createAction, { isLoading: isSaving }] = useCreateDisciplinaryActionMutation();
  const [updateAction] = useUpdateDisciplinaryActionMutation();

  const employees = employeesData?.data || [];
  const rows = data?.data || [];

  const handleSubmit = async (values: any) => {
    try {
      await createAction({ ...values, actionDate: values.actionDate?.format("YYYY-MM-DD") }).unwrap();
      message.success("Disciplinary action recorded");
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save action");
    }
  };

  const handleStatus = async (record: any, status: string) => {
    try {
      await updateAction({ id: record.id, status }).unwrap();
      message.success("Status updated");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Disciplinary Actions" />
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Action Register"
        extra={<Space><Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} className="bg-emerald-600 border-none">Add Action</Button></Space>}
      >
        <Table
          loading={isLoading}
          dataSource={rows}
          rowKey="id"
          columns={[
            { title: "Employee", dataIndex: ["employee", "fullName"], key: "employee", render: (v: string, r: any) => v || r.employee?.name },
            { title: "Type", dataIndex: "actionType", key: "type", render: (v: string) => <Tag color="volcano">{v || "Warning"}</Tag> },
            { title: "Date", dataIndex: "actionDate", key: "date" },
            { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Resolved" ? "green" : "orange"}>{v || "Open"}</Tag> },
            { title: "Action", key: "action", render: (_: any, r: any) => <Space><Button size="small" icon={<EyeOutlined />} onClick={() => setDetailRecord(r)}>View</Button><Button size="small" onClick={() => handleStatus(r, "Resolved")}>Resolve</Button></Space> },
          ]}
        />
      </Card>

      <Modal title="Add Disciplinary Action" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" optionFilterProp="children">{employees.map((emp: any) => <Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</Option>)}</Select>
          </Form.Item>
          <Form.Item name="actionType" label="Action Type" initialValue="Warning">
            <Select><Option value="Warning">Warning</Option><Option value="Show Cause">Show Cause</Option><Option value="Suspension">Suspension</Option><Option value="Termination">Termination</Option></Select>
          </Form.Item>
          <Form.Item name="actionDate" label="Action Date" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea rows={4} /></Form.Item>
          <div className="flex justify-end gap-2"><Button onClick={() => setModalOpen(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isSaving} className="bg-emerald-600 border-none">Save</Button></div>
        </Form>
      </Modal>

      <Drawer title="Disciplinary Details" width={520} open={Boolean(detailRecord)} onClose={() => setDetailRecord(null)}>
        {detailRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Employee">{detailRecord.employee?.fullName || detailRecord.employee?.name}</Descriptions.Item>
            <Descriptions.Item label="Type">{detailRecord.actionType}</Descriptions.Item>
            <Descriptions.Item label="Date">{detailRecord.actionDate}</Descriptions.Item>
            <Descriptions.Item label="Status">{detailRecord.status || "Open"}</Descriptions.Item>
            <Descriptions.Item label="Description">{detailRecord.description || "-"}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
