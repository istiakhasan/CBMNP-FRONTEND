"use client";

import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, Modal, Select, Space, Table, Tag, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useCreateTrainingProgramMutation,
  useGetEmployeesQuery,
  useGetTrainingProgramsQuery,
  useEnrollInTrainingMutation,
} from "@/redux/api/hrPayrollApi";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TrainingPage() {
  const [programModal, setProgramModal] = useState(false);
  const [enrollModal, setEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programForm] = Form.useForm();
  const [enrollForm] = Form.useForm();
  const { data, isLoading, refetch } = useGetTrainingProgramsQuery(undefined);
  const { data: employeesData } = useGetEmployeesQuery(undefined);
  const [createProgram, { isLoading: isCreating }] = useCreateTrainingProgramMutation();
  const [enrollEmployee, { isLoading: isEnrolling }] = useEnrollInTrainingMutation();

  const programs = data?.data || [];
  const employees = employeesData?.data || [];

  const handleCreate = async (values: any) => {
    try {
      await createProgram({
        ...values,
        startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
      }).unwrap();
      message.success("Training program created");
      setProgramModal(false);
      programForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create training");
    }
  };

  const handleEnroll = async (values: any) => {
    try {
      await enrollEmployee({ trainingProgramId: selectedProgram?.id, ...values }).unwrap();
      message.success("Employee enrolled");
      setEnrollModal(false);
      enrollForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to enroll employee");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Training Programs" />
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Training Calendar"
        extra={<Space><Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setProgramModal(true)} className="bg-emerald-600 border-none">Add Program</Button></Space>}
      >
        <Table
          loading={isLoading}
          dataSource={programs}
          rowKey="id"
          columns={[
            { title: "Program", dataIndex: "title", key: "title", render: (v: string) => <span className="font-semibold">{v}</span> },
            { title: "Trainer", dataIndex: "trainerName", key: "trainer" },
            { title: "Date", key: "date", render: (_: any, r: any) => `${r.startDate || "-"} to ${r.endDate || "-"}` },
            { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Completed" ? "green" : "blue"}>{v || "Planned"}</Tag> },
            { title: "Action", key: "action", render: (_: any, r: any) => <Button size="small" onClick={() => { setSelectedProgram(r); setEnrollModal(true); }}>Enroll</Button> },
          ]}
        />
      </Card>

      <Modal title="Add Training Program" open={programModal} onCancel={() => setProgramModal(false)} footer={null} destroyOnClose>
        <Form form={programForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Program Title" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="trainerName" label="Trainer"><Input /></Form.Item>
          <Form.Item name="dateRange" label="Training Date"><RangePicker className="w-full" /></Form.Item>
          <Form.Item name="description" label="Description"><Input.TextArea rows={3} /></Form.Item>
          <div className="flex justify-end gap-2"><Button onClick={() => setProgramModal(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isCreating} className="bg-emerald-600 border-none">Save</Button></div>
        </Form>
      </Modal>

      <Modal title={`Enroll Employee${selectedProgram ? ` - ${selectedProgram.title}` : ""}`} open={enrollModal} onCancel={() => setEnrollModal(false)} footer={null} destroyOnClose>
        <Form form={enrollForm} layout="vertical" onFinish={handleEnroll}>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" optionFilterProp="children">
              {employees.map((emp: any) => <Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeCode})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="Remarks"><Input.TextArea rows={3} /></Form.Item>
          <div className="flex justify-end gap-2"><Button onClick={() => setEnrollModal(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isEnrolling} className="bg-emerald-600 border-none">Enroll</Button></div>
        </Form>
      </Modal>
    </div>
  );
}
