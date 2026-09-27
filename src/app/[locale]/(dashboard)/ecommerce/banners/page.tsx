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
import { PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

export default function BannersManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: bannersRes, isLoading } = useGetEcommerceResourceQuery({ resource: "banners" });
  const [createBanner, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deleteBanner] = useDeleteEcommerceResourceMutation();

  const banners = bannersRes?.data || [];

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        bannerType: "hero",
        buttonText: "Shop Now",
        buttonLink: "/collections/all",
        textAlignment: "center",
        overlayOpacity: 0.3,
        sortOrder: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingItem) {
        await updateBanner({ resource: "banners", id: editingItem.id, data: values }).unwrap();
        message.success("Banner updated successfully!");
      } else {
        await createBanner({ resource: "banners", data: values }).unwrap();
        message.success("Banner created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner({ resource: "banners", id }).unwrap();
      message.success("Banner deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete banner");
    }
  };

  const columns = [
    {
      title: "Preview",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url: string) => (
        <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          <img src={url} alt="Banner" className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      title: "Headline & Subtitle",
      key: "title",
      render: (_: any, r: any) => (
        <div>
          <p className="font-bold text-slate-800 text-sm">{r.title}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{r.subtitle || "—"}</p>
          {r.badgeText && (
            <Tag color="gold" className="text-[10px] mt-1">
              {r.badgeText}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "bannerType",
      key: "bannerType",
      render: (type: string) => (
        <Tag color={type === "hero" ? "blue" : "purple"} className="uppercase text-[11px] font-semibold">
          {type}
        </Tag>
      ),
    },
    {
      title: "Button CTA",
      key: "cta",
      render: (_: any, r: any) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800">{r.buttonText}</span>
          <span className="text-slate-400 block truncate max-w-[150px]">{r.buttonLink}</span>
        </div>
      ),
    },
    {
      title: "Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 70,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (
        <Tag color={active ? "success" : "default"}>
          {active ? "Active" : "Hidden"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(r)} />
          <Popconfirm title="Delete this banner?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Hero Slides & Promotional Banners" />

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={<span className="font-bold text-slate-800 text-base">Storefront Banners & Sliders</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Create Banner
          </Button>
        }
      >
        <Table
          dataSource={banners}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Banner" : "Create New Banner"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Banner Headline Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Timeless Modesty, Modern Grace" />
          </Form.Item>

          <Form.Item name="subtitle" label="Subtitle / Tagline">
            <Input placeholder="e.g. Handcrafted luxury abayas crafted with bespoke French crepe." />
          </Form.Item>

          <Form.Item name="badgeText" label="Badge Chip Text (Optional)">
            <Input placeholder="e.g. Autumn / Eid 2026 Collection" />
          </Form.Item>

          <Form.Item name="imageUrl" label="Desktop Banner Image URL" rules={[{ required: true }]}>
            <Input placeholder="https://images.unsplash.com/... or /api/v1/images/..." />
          </Form.Item>

          <Form.Item name="mobileImageUrl" label="Mobile Optimized Image URL (Optional)">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="buttonText" label="Button CTA Text" rules={[{ required: true }]}>
              <Input placeholder="Shop Now" />
            </Form.Item>

            <Form.Item name="buttonLink" label="Button Destination Link" rules={[{ required: true }]}>
              <Input placeholder="/collections/all" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="bannerType" label="Banner Placement">
              <Select
                options={[
                  { label: "Hero Slideshow", value: "hero" },
                  { label: "Middle Promo", value: "promo-middle" },
                  { label: "Story / Lookbook", value: "lookbook" },
                ]}
              />
            </Form.Item>

            <Form.Item name="sortOrder" label="Sort Order">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="Visibility">
              <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
