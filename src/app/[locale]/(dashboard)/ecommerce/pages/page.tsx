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
  Switch,
  Tag,
  Space,
  Popconfirm,
  message,
  Card,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  useGetEcommerceResourceQuery,
  useCreateEcommerceResourceMutation,
  useUpdateEcommerceResourceMutation,
  useDeleteEcommerceResourceMutation,
} from "@/redux/api/ecommerceApi";

const PAGE_TEMPLATES = [
  {
    name: "About Tabaya / Brand Story",
    slug: "about-us",
    placement: "header",
    title: "About Tabaya - Luxury Modest Fashion",
    content: `## Our Story
Founded with a devotion to timeless modest elegance, Tabaya crafts bespoke abayas, hijabs, and contemporary modest silhouettes for the modern woman.

### Craftsmanship & Fabrics
Every piece is meticulously tailored using premium Nida, Medina silk, and Japanese crepe sourced directly from leading textile houses.

### Our Promise
- 100% Original Premium Fabrics
- Ethical Tailoring & Flawless Cuts
- Worldwide & Express Delivery`,
  },
  {
    name: "Abaya Size & Fit Guide",
    slug: "size-guide",
    placement: "footer",
    title: "Abaya & Modest Wear Size Guide",
    content: `## Finding Your Perfect Abaya Length
Abayas are traditionally measured by total height from the top of the shoulder down to the hem in inches.

| Size | Height (Feet/Inches) | Bust / Chest (Inches) | Sleeve Length (Inches) |
|---|---|---|---|
| **52** | 5'0" - 5'2" | 40" - 42" | 26" |
| **54** | 5'3" - 5'4" | 42" - 44" | 27" |
| **56** | 5'5" - 5'6" | 44" - 46" | 28" |
| **58** | 5'7" - 5'8" | 46" - 48" | 29" |
| **60** | 5'9"+ | 48" - 50" | 30" |

> **Need custom measurements?** Contact our concierge styling team via WhatsApp for bespoke alterations.`,
  },
  {
    name: "Return & Exchange Policy",
    slug: "returns-exchanges",
    placement: "policy",
    title: "Return, Exchange & Refund Policy",
    content: `## Hassle-Free 7-Day Exchange
We want you to feel confident and beautiful in your Tabaya pieces.

### Terms & Conditions
1. Items must be returned within **7 days** of delivery in original condition, unworn, unwashed, with all original tags attached.
2. Custom bespoke alterations are final sale unless there is a manufacturing defect.
3. For exchanges, delivery charges apply unless the exchange is due to an error on our part.`,
  },
  {
    name: "Fabric & Garment Care",
    slug: "fabric-care",
    placement: "policy",
    title: "Luxury Fabric Care Instructions",
    content: `## Preserving Your Garment's Elegance
- **Hand Wash or Dry Clean**: Delicate hand washing in cold water with mild detergent is recommended for silk and embellished abayas.
- **Steam Ironing**: Use low heat or a garment steamer. Avoid direct high-heat iron on embroidery or crystal work.
- **Storage**: Hang on padded hangers away from direct sunlight to maintain rich fabric luster.`,
  },
];

export default function PagesManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: pagesRes, isLoading } = useGetEcommerceResourceQuery({ resource: "pages" });
  const [createPage, { isLoading: isCreating }] = useCreateEcommerceResourceMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdateEcommerceResourceMutation();
  const [deletePage] = useDeleteEcommerceResourceMutation();

  const pages = pagesRes?.data || [];

  const handleOpenModal = (record?: any) => {
    setEditingItem(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        placement: "footer",
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleApplyTemplate = (template: (typeof PAGE_TEMPLATES)[0]) => {
    form.setFieldsValue({
      title: template.title,
      slug: template.slug,
      placement: template.placement,
      content: template.content,
      isPublished: true,
    });
    message.success(`Applied "${template.name}" template!`);
  };

  const handleSubmit = async (values: any) => {
    try {
      values.slug = values.slug.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      if (editingItem) {
        await updatePage({ resource: "pages", id: editingItem.id, data: values }).unwrap();
        message.success("Page updated!");
      } else {
        await createPage({ resource: "pages", data: values }).unwrap();
        message.success("Page created!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePage({ resource: "pages", id }).unwrap();
      message.success("Page deleted!");
    } catch (err: any) {
      message.error(err?.data?.message || "Failed to delete page");
    }
  };

  const columns = [
    {
      title: "Page Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, r: any) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-slate-400 text-base" />
          <div>
            <div className="font-semibold text-slate-800">{title}</div>
            <div className="text-xs text-slate-400 font-mono">/pages/{r.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Placement",
      dataIndex: "placement",
      key: "placement",
      render: (placement: string) => {
        const colorMap: Record<string, string> = {
          header: "blue",
          footer: "purple",
          policy: "gold",
          hidden: "default",
        };
        return (
          <Tag color={colorMap[placement] || "default"} className="capitalize font-medium">
            {placement}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (pub: boolean) => (
        <Tag color={pub ? "success" : "default"}>{pub ? "Published" : "Draft"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(r)} />
          <Popconfirm title="Delete page?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <GbHeader title="CMS Pages, Size Guides & Policies" />

      {/* Preset Quick Starters */}
      <Card className="rounded-2xl border-slate-200 shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              Storefront Content
            </div>
            <h2 className="text-lg md:text-xl font-bold">1-Click Policy & Content Templates</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Instantly create luxury brand stories, standard size guides, and return policies tailored for high-end modest fashion storefronts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PAGE_TEMPLATES.map((tmpl, idx) => (
              <Button
                key={idx}
                size="small"
                icon={<ThunderboltOutlined />}
                onClick={() => {
                  handleOpenModal();
                  setTimeout(() => handleApplyTemplate(tmpl), 50);
                }}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                + {tmpl.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card
        className="rounded-2xl shadow-sm border-slate-200"
        title={<span className="font-bold text-slate-800 text-base">Custom Store Pages ({pages.length})</span>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            className="bg-slate-900 hover:bg-slate-800"
          >
            Create New Page
          </Button>
        }
      >
        <Table
          dataSource={pages}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingItem ? "Edit Store Page" : "Create New Store Page"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={isCreating || isUpdating}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="title" label="Page Title" rules={[{ required: true }]}>
              <Input
                placeholder="e.g. Fabric & Size Guide"
                onChange={(e) => {
                  if (!editingItem) {
                    const slug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");
                    form.setFieldsValue({ slug });
                  }
                }}
              />
            </Form.Item>

            <Form.Item name="slug" label="URL Slug (/pages/...)" rules={[{ required: true }]}>
              <Input placeholder="size-guide" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="placement" label="Navigation Placement" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Header & Main Menu", value: "header" },
                  { label: "Footer Links", value: "footer" },
                  { label: "Policies & Legal", value: "policy" },
                  { label: "Hidden / Direct Link Only", value: "hidden" },
                ]}
              />
            </Form.Item>

            <Form.Item name="isPublished" valuePropName="checked" label="Publication Status">
              <Switch checkedChildren="Published" unCheckedChildren="Draft" />
            </Form.Item>
          </div>

          <Form.Item
            name="content"
            label="Page Content (Markdown / HTML Supported)"
            rules={[{ required: true }]}
            extra="You can use standard markdown like headers (##), bold (**text**), bullet points, and tables."
          >
            <Input.TextArea
              rows={12}
              className="font-mono text-xs leading-relaxed"
              placeholder="Write page content in markdown or HTML..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
