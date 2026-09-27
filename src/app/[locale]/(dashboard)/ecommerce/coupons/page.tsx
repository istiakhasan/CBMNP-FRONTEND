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
  DatePicker,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

export default function CouponsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: couponsRes, isLoading } = useGetEcommerceResourceQuery({ resource: "coupons" });
  const [createCoupon, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deleteCoupon] = useDeleteEcommerceResourceMutation();

  const coupons = couponsRes?.data || [];

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 1000,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      values.code = values.code.toUpperCase().trim();
      if (editingItem) {
        await updateCoupon({ resource: "coupons", id: editingItem.id, data: values }).unwrap();
        message.success("Coupon updated!");
      } else {
        await createCoupon({ resource: "coupons", data: values }).unwrap();
        message.success("Coupon created!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon({ resource: "coupons", id }).unwrap();
      message.success("Coupon deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete coupon");
    }
  };

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <span className="font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-sm">
          {code}
        </span>
      ),
    },
    {
      title: "Discount Value",
      key: "discount",
      render: (_: any, r: any) => (
        <span className="font-bold text-slate-800">
          {r.discountType === "percentage"
            ? `${r.discountValue}% OFF`
            : r.discountType === "fixed"
            ? `৳${r.discountValue} FLAT OFF`
            : "FREE SHIPPING"}
        </span>
      ),
    },
    {
      title: "Min. Order",
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      render: (val: number) => `৳${val || 0}`,
    },
    {
      title: "Redemptions",
      key: "usage",
      render: (_: any, r: any) => (
        <span className="text-xs text-slate-600">
          {r.usedCount || 0} {r.usageLimit ? `/ ${r.usageLimit}` : "times"}
        </span>
      ),
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
          <Popconfirm title="Delete coupon?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Promo Coupons & Discount Vouchers" />

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={<span className="font-bold text-slate-800 text-base">Store Discount Engine</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Create Coupon
          </Button>
        }
      >
        <Table
          dataSource={coupons}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Coupon" : "Create Promo Coupon"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="code" label="Promo Voucher Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. EID2026, TABAYA10, FREESHIP" className="uppercase font-mono font-bold" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discountType" label="Discount Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Percentage (%)", value: "percentage" },
                  { label: "Flat Amount (৳)", value: "fixed" },
                  { label: "Free Shipping", value: "free_shipping" },
                ]}
              />
            </Form.Item>

            <Form.Item name="discountValue" label="Discount Value" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" placeholder="10 or 500" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="minOrderAmount" label="Minimum Order Value (৳)">
              <InputNumber min={0} className="w-full" placeholder="1000" />
            </Form.Item>

            <Form.Item name="maxDiscountAmount" label="Max Discount Capped (৳)">
              <InputNumber min={0} className="w-full" placeholder="Optional" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="usageLimit" label="Total Usage Limit">
              <InputNumber min={1} className="w-full" placeholder="e.g. 500 uses" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="Coupon Status">
              <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
