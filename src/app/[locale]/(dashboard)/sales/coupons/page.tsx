"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Input,
  Card,
  Tag,
  Space,
  message,
  Switch,
} from "antd";
import { PlusOutlined, ReloadOutlined, PercentageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useCreateCouponMutation,
} from "@/redux/api/salesOperationsApi";
import GbHeader from "@/components/ui/dashboard/GbHeader";

const { Option } = Select;

export default function CouponsPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : undefined,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
      };
      await createCoupon(payload).unwrap();
      message.success("Coupon created successfully");
      setModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <GbHeader title="Coupons & Promotional Campaigns" />

      <Card
        title="Promotional Discount Codes"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            style={{ backgroundColor: "#1890ff" }}
          >
            Create Promo Coupon
          </Button>
        }
        className="shadow-sm rounded-lg"
      >
        <p className="text-gray-500">
          Coupons can be applied during customer checkout and order booking to provide percentage or flat discounts.
        </p>
      </Card>

      {/* Modal Form */}
      <Modal
        title="Create Promo Discount Coupon"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            discountType: "Percentage",
            discountValue: 10,
            minOrderValue: 500,
            isActive: true,
          }}
        >
          <Form.Item name="code" label="Coupon Promo Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. EID2025 or WELCOME100" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discountType" label="Discount Type" rules={[{ required: true }]}>
              <Select>
                <Option value="Percentage">Percentage (%)</Option>
                <Option value="FlatAmount">Flat Amount (Tk)</Option>
              </Select>
            </Form.Item>

            <Form.Item name="discountValue" label="Discount Value" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="minOrderValue" label="Min Order Value (Tk)">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="maxDiscountAmount" label="Max Discount Cap (Tk)">
              <InputNumber min={0} className="w-full" placeholder="For % discounts" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="startDate" label="Start Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="endDate" label="Expiry Date">
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
