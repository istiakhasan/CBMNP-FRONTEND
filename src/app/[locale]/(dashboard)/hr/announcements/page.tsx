"use client";

import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAnnouncementsQuery,
  useUpdateAnnouncementMutation,
} from "@/redux/api/hrPayrollApi";

const { Option } = Select;

export default function AnnouncementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const { data, isLoading, refetch } = useGetAnnouncementsQuery(undefined);
  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const rows = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload = { ...values, publishDate: values.publishDate?.format?.("YYYY-MM-DD") || values.publishDate };
    try {
      if (editing) {
        await updateAnnouncement({ id: editing.id, ...payload }).unwrap();
        message.success("Announcement updated");
      } else {
        await createAnnouncement(payload).unwrap();
        message.success("Announcement published");
      }
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save announcement");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id).unwrap();
      message.success("Announcement deleted");
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete announcement");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="HR Announcements" />
      <Card
        className="rounded-xl border border-gray-200 shadow-sm"
        title="Notice Board"
        extra={<Space><Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button><Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className="bg-emerald-600 border-none">New Notice</Button></Space>}
      >
        <Table
          loading={isLoading}
          dataSource={rows}
          rowKey="id"
          columns={[
            { title: "Title", dataIndex: "title", key: "title", render: (v: string) => <span className="font-semibold">{v}</span> },
            { title: "Audience", dataIndex: "audience", key: "audience", render: (v: string) => <Tag color="blue">{v || "All Employees"}</Tag> },
            { title: "Publish Date", dataIndex: "publishDate", key: "publishDate" },
            { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <Tag color={v === "Inactive" ? "default" : "green"}>{v || "Active"}</Tag> },
            {
              title: "Action",
              key: "action",
              render: (_: any, r: any) => (
                <Space>
                  <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                  <Popconfirm title="Delete this announcement?" onConfirm={() => handleDelete(r.id)}>
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal title={editing ? "Edit Announcement" : "New Announcement"} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="audience" label="Audience" initialValue="All Employees">
            <Select><Option value="All Employees">All Employees</Option><Option value="Management">Management</Option><Option value="Department Wise">Department Wise</Option></Select>
          </Form.Item>
          <Form.Item name="publishDate" label="Publish Date"><DatePicker className="w-full" /></Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}><Input.TextArea rows={5} /></Form.Item>
          <Form.Item name="status" label="Status" initialValue="Active"><Select><Option value="Active">Active</Option><Option value="Inactive">Inactive</Option></Select></Form.Item>
          <div className="flex justify-end gap-2"><Button onClick={() => setModalOpen(false)}>Cancel</Button><Button type="primary" htmlType="submit" loading={isCreating || isUpdating} className="bg-emerald-600 border-none">Save</Button></div>
        </Form>
      </Modal>
    </div>
  );
}
