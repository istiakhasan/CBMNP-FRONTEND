"use client";
import React, { useState } from "react";
import GbHeader from "@/components/ui/dashboard/GbHeader";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Card,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CarOutlined } from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

export default function ShippingManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: shippingRes, isLoading } = useGetEcommerceResourceQuery({ resource: "shipping" });
  const [createShipping, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updateShipping, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deleteShipping] = useDeleteEcommerceResourceMutation();

  const shippingRules = shippingRes?.data || [];

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        zoneType: "inside_dhaka",
        cost: 80,
        estimatedDeliveryTime: "24 - 48 Hours",
        freeShippingAbove: 2500,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await updateShipping({ resource: "shipping", id: editingItem.id, data: values }).unwrap();
        message.success("Shipping rule updated!");
      } else {
        await createShipping({ resource: "shipping", data: values }).unwrap();
        message.success("Shipping rule created!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShipping({ resource: "shipping", id }).unwrap();
      message.success("Shipping rule deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete shipping rule");
    }
  };

  const columns = [
    {
      title: "Delivery Method / Zone",
      key: "name",
      render: (_: any, r: any) => (
        <div>
          <p className="font-bold text-slate-800 text-sm">{r.name}</p>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{r.zoneType?.replace("_", " ")}</span>
        </div>
      ),
    },
    {
      title: "Shipping Charge",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number) => <span className="font-bold text-slate-900">৳ {cost}</span>,
    },
    {
      title: "Estimated Time",
      dataIndex: "estimatedDeliveryTime",
      key: "estimatedDeliveryTime",
      render: (time: string) => <Tag color="blue">{time || "2 - 3 Days"}</Tag>,
    },
    {
      title: "Free Delivery Above",
      dataIndex: "freeShippingAbove",
      key: "freeShippingAbove",
      render: (amount: number) =>
        amount ? <span className="text-emerald-700 font-semibold">Orders &gt; ৳{amount}</span> : <span className="text-slate-400">—</span>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "success" : "default"}>
          {active ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(r)} />
          <Popconfirm title="Delete this rule?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Shipping & Delivery Rates" />

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={<span className="font-bold text-slate-800 text-base">Store Shipping Zones & Rates</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Add Shipping Method
          </Button>
        }
      >
        <Table
          dataSource={shippingRules}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Shipping Rule" : "Create Shipping Rule"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Shipping Method Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Inside Dhaka Standard, Outside Dhaka Express" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="zoneType" label="Zone Coverage" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Inside Dhaka", value: "inside_dhaka" },
                  { label: "Outside Dhaka", value: "outside_dhaka" },
                  { label: "Nationwide (All Districts)", value: "nationwide" },
                ]}
              />
            </Form.Item>

            <Form.Item name="cost" label="Delivery Charge (৳)" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" placeholder="80 or 150" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="estimatedDeliveryTime" label="Estimated Delivery Time">
              <Input placeholder="e.g. 24 - 48 Hours" />
            </Form.Item>

            <Form.Item name="freeShippingAbove" label="Free Shipping Threshold (৳)">
              <InputNumber min={0} className="w-full" placeholder="2500" />
            </Form.Item>
          </div>

          <Form.Item name="isActive" valuePropName="checked" label="Status">
            <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
