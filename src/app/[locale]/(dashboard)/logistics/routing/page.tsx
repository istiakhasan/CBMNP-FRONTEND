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
  Card,
  Tag,
  Space,
  message,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  useGetRoutingRulesQuery,
  useCreateRoutingRuleMutation,
} from "@/redux/api/logisticsOperationsApi";
import { useGetDeliveryPartnersQuery } from "@/redux/api/partnerApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function LogisticsRoutingPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetRoutingRulesQuery(undefined);
  const { data: partnersData } = useGetDeliveryPartnersQuery(undefined);
  const [createRule, { isLoading: isCreating }] = useCreateRoutingRuleMutation();

  const handleFinish = async (values: any) => {
    try {
      await createRule(values).unwrap();
      message.success("Courier routing rule created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create rule");
    }
  };

  const rules = data?.data || [];
  const partners = partnersData?.data || [];

  const columns: any = [
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      align: "center" as const,
      render: (p: number) => <Tag color="blue">P{p}</Tag>,
    },
    {
      title: "Rule Name",
      dataIndex: "ruleName",
      key: "ruleName",
      render: (name: string) => <span className="font-semibold text-gray-900">{name}</span>,
    },
    {
      title: "Courier Partner",
      dataIndex: ["courierPartner", "partnerName"],
      key: "courierPartner",
      render: (name: string, record: any) => (
        <span className="font-bold text-orange-600">{name || record.courierPartner?.name}</span>
      ),
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
      render: (d: string) => d || <Tag color="default">All Divisions</Tag>,
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      render: (d: string) => d || <Tag color="default">All Districts</Tag>,
    },
    {
      title: "Max Weight",
      dataIndex: "maxWeightKg",
      key: "maxWeightKg",
      render: (w: number) => w ? `${w} Kg` : "Unlimited",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      align: "center" as const,
      render: (active: boolean) => <Tag color={active ? "success" : "default"}>{active ? "Active" : "Inactive"}</Tag>,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Automated Multi-Courier Routing Engine" />

      <Card
        title="Active Courier Routing Rules"
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
              Add Routing Rule
            </Button>
          </Space>
        }
        className="shadow-sm rounded-lg"
      >
        <Table columns={columns} dataSource={rules} rowKey="id" loading={isLoading} pagination={false} size="middle" />
      </Card>

      {/* Modal Form */}
      <Modal
        title="Create Courier Routing Rule"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ priority: 1, isActive: true }}>
          <Form.Item name="ruleName" label="Rule Description" rules={[{ required: true }]}>
            <Input placeholder="e.g. Inside Dhaka Express Parcels" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="courierPartnerId" label="Assigned Courier Partner" rules={[{ required: true }]}>
              <Select placeholder="Select Courier">
                {partners.map((p: any) => (
                  <Option key={p.id} value={p.id}>
                    {p.partnerName || p.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="priority" label="Priority Order" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="division" label="Division (Optional)">
              <Input placeholder="e.g. Dhaka" />
            </Form.Item>

            <Form.Item name="district" label="District (Optional)">
              <Input placeholder="e.g. Gazipur" />
            </Form.Item>
          </div>

          <Form.Item name="maxWeightKg" label="Max Parcel Weight (Kg)">
            <InputNumber min={0.5} step={0.5} className="w-full" placeholder="e.g. 2.0" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
