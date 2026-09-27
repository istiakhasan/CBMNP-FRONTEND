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
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

const { TextArea } = Input;

export default function CollectionsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: collectionsRes, isLoading } = useGetEcommerceResourceQuery({ resource: "collections" });
  const [createCollection, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updateCollection, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deleteCollection] = useDeleteEcommerceResourceMutation();

  const collections = collectionsRes?.data || [];

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        isFeatured: true,
        sortOrder: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!values.slug && values.name) {
        values.slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      if (editingItem) {
        await updateCollection({ resource: "collections", id: editingItem.id, data: values }).unwrap();
        message.success("Collection updated successfully!");
      } else {
        await createCollection({ resource: "collections", data: values }).unwrap();
        message.success("Collection created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection({ resource: "collections", id }).unwrap();
      message.success("Collection deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete collection");
    }
  };

  const columns = [
    {
      title: "Cover Image",
      dataIndex: "bannerImageUrl",
      key: "bannerImageUrl",
      render: (url: string) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={url || "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop"}
            alt="Collection"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "Collection Name & Slug",
      key: "name",
      render: (_: any, r: any) => (
        <div>
          <p className="font-bold text-slate-800 text-sm">{r.name}</p>
          <span className="text-xs text-slate-400 font-mono">/collections/{r.slug}</span>
          {r.badgeText && (
            <Tag color="#beaa8d" className="text-slate-900 text-[10px] font-bold border-none ml-2">
              {r.badgeText}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (featured: boolean) => (
        <Tag color={featured ? "gold" : "default"}>
          {featured ? "Featured on Home" : "Standard"}
        </Tag>
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
          <Popconfirm title="Delete this collection?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="Curated Collections & Catalogs" />

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={<span className="font-bold text-slate-800 text-base">Store Collections & Lookbooks</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Create Collection
          </Button>
        }
      >
        <Table
          dataSource={collections}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Collection" : "Create Curated Collection"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Collection Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Festive Eid 2026, Luxury Abayas, Silk Hijabs" />
          </Form.Item>

          <Form.Item name="slug" label="URL Slug (Optional - Auto generated if blank)">
            <Input placeholder="e.g. luxury-abayas" className="font-mono text-xs" />
          </Form.Item>

          <Form.Item name="badgeText" label="Badge Chip (Optional)">
            <Input placeholder="e.g. Best Seller, Trending, New Drop" />
          </Form.Item>

          <Form.Item name="bannerImageUrl" label="Cover / Grid Image URL">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item name="description" label="Description / Story">
            <TextArea rows={3} placeholder="Handcrafted with bespoke French crepe and intricate embroidery." />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="isFeatured" valuePropName="checked" label="Home Showcase">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item name="sortOrder" label="Sort Order">
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked" label="Status">
              <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
