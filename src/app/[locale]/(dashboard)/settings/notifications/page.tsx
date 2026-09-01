"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Card,
  Tag,
  Space,
  message,
  Switch,
} from "antd";
import { PlusOutlined, ReloadOutlined, MessageOutlined } from "@ant-design/icons";
import {
  useGetSmsTemplatesQuery,
  useCreateSmsTemplateMutation,
  useGetSmsLogsQuery,
} from "@/redux/api/notificationsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function NotificationSettingsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: templatesData, isLoading: isTemplatesLoading, refetch: refetchTemplates } = useGetSmsTemplatesQuery(undefined);
  const { data: logsData, isLoading: isLogsLoading, refetch: refetchLogs } = useGetSmsLogsQuery(undefined);

  const [createTemplate, { isLoading: isCreating }] = useCreateSmsTemplateMutation();

  const handleFinish = async (values: any) => {
    try {
      await createTemplate(values).unwrap();
      message.success("SMS Template saved successfully");
      setModalOpen(false);
      form.resetFields();
      refetchTemplates();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to save template");
    }
  };

  const templates = templatesData?.data || [];
  const logs = logsData?.data || [];

  const templateColumns: any = [
    {
      title: "Trigger Event",
      dataIndex: "triggerEvent",
      key: "triggerEvent",
      render: (e: string) => <Tag color="blue">{e}</Tag>,
    },
    {
      title: "Template Message Body",
      dataIndex: "templateBody",
      key: "templateBody",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (a: boolean) => <Tag color={a ? "success" : "default"}>{a ? "Active" : "Disabled"}</Tag>,
    },
  ];

  const logColumns: any = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleString(),
    },
    {
      title: "Recipient Phone",
      dataIndex: "recipientPhone",
      key: "recipientPhone",
      render: (p: string) => <span className="font-mono">{p}</span>,
    },
    {
      title: "SMS Body",
      dataIndex: "messageBody",
      key: "messageBody",
    },
    {
      title: "Delivery Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (st: string) => <Tag color={st === "Sent" ? "green" : "volcano"}>{st}</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Automated Customer Notifications & SMS Gateway" />

      {/* Templates */}
      <Card
        title="Automated SMS Event Templates"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetchTemplates()}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ backgroundColor: "#1890ff" }}
            >
              Configure Template
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={templateColumns} dataSource={templates} rowKey="id" loading={isTemplatesLoading} pagination={false} size="middle" />
      </Card>

      {/* Outbound SMS Logs */}
      <Card
        title="Outbound SMS Delivery Logs"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetchLogs()}>
            Refresh
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={logColumns} dataSource={logs} rowKey="id" loading={isLogsLoading} pagination={{ pageSize: 10 }} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Configure SMS Event Template"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ isActive: true }}>
          <Form.Item name="triggerEvent" label="Trigger Event" rules={[{ required: true }]}>
            <Select placeholder="Select Trigger Event">
              <Option value="OrderCreated">Order Created</Option>
              <Option value="OrderApproved">Order Approved</Option>
              <Option value="OrderDispatched">Order Dispatched (Shipped)</Option>
              <Option value="OrderDelivered">Order Delivered</Option>
              <Option value="OrderCancelled">Order Cancelled</Option>
              <Option value="PaymentReceived">Payment Received</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="templateBody"
            label="Template Message (Use {{customerName}}, {{orderId}}, {{amount}}, {{trackingCode}})"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Dear {{customerName}}, your order {{orderId}} of Tk {{amount}} has been dispatched with tracking #{{trackingCode}}. Thank you for shopping with us!"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
